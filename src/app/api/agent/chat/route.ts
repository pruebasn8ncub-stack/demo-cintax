import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type {
  MessageParam,
  ContentBlockParam,
  TextBlockParam,
  ToolUseBlockParam,
  ToolResultBlockParam,
  ContentBlock,
} from "@anthropic-ai/sdk/resources/messages";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/agent/system-prompt";
import { agentTools } from "@/lib/agent/tools";
import { executeToolCall } from "@/lib/agent/handlers";

// ---- Input validation ----

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      })
    )
    .min(1),
  stream: z.boolean().optional(),
});

// ---- Rate limiting ----

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1_000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ---- Anthropic client ----

const anthropic = new Anthropic();

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOOL_ITERATIONS = 5;

// ---- SSE helpers ----

function sseEncode(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// ---- Helpers to convert SDK content blocks to Param blocks ----

function contentBlockToParam(block: ContentBlock): ContentBlockParam {
  if (block.type === "text") {
    return { type: "text", text: block.text } satisfies TextBlockParam;
  }
  if (block.type === "tool_use") {
    return {
      type: "tool_use",
      id: block.id,
      name: block.name,
      input: block.input,
    } satisfies ToolUseBlockParam;
  }
  // For any other block type, return a text placeholder
  return { type: "text", text: "" } satisfies TextBlockParam;
}

function buildToolResult(
  toolUseId: string,
  content: string
): ToolResultBlockParam {
  return {
    type: "tool_result",
    tool_use_id: toolUseId,
    content,
  };
}

// ---- Streaming handler ----

async function handleStreaming(
  messages: MessageParam[]
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let conversationMessages: MessageParam[] = [...messages];
        let iterations = 0;

        while (iterations < MAX_TOOL_ITERATIONS) {
          iterations += 1;

          const stream = anthropic.messages.stream({
            model: MODEL,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: conversationMessages,
            tools: agentTools,
          });

          let hasToolUse = false;
          const collectedToolBlocks: Array<{
            id: string;
            name: string;
            input: Record<string, unknown>;
          }> = [];
          let currentToolInput = "";
          let currentToolName = "";
          let currentToolId = "";

          for await (const event of stream) {
            if (event.type === "content_block_start") {
              if (event.content_block.type === "text") {
                // Text block starting
              } else if (event.content_block.type === "tool_use") {
                hasToolUse = true;
                currentToolName = event.content_block.name;
                currentToolId = event.content_block.id;
                currentToolInput = "";
                controller.enqueue(
                  encoder.encode(
                    sseEncode({
                      type: "tool_start",
                      tool: event.content_block.name,
                    })
                  )
                );
              }
            } else if (event.type === "content_block_delta") {
              if (event.delta.type === "text_delta") {
                if (!hasToolUse) {
                  controller.enqueue(
                    encoder.encode(
                      sseEncode({
                        type: "text_delta",
                        content: event.delta.text,
                      })
                    )
                  );
                }
              } else if (event.delta.type === "input_json_delta") {
                currentToolInput += event.delta.partial_json;
              }
            } else if (event.type === "content_block_stop") {
              if (currentToolId && currentToolName) {
                const parsedInput = currentToolInput
                  ? (JSON.parse(currentToolInput) as Record<string, unknown>)
                  : {};

                collectedToolBlocks.push({
                  id: currentToolId,
                  name: currentToolName,
                  input: parsedInput,
                });

                currentToolId = "";
                currentToolName = "";
                currentToolInput = "";
              }
            }
          }

          const finalMessage = await stream.finalMessage();

          if (!hasToolUse || finalMessage.stop_reason !== "tool_use") {
            // Stream final text if this is a subsequent iteration
            if (iterations > 1) {
              for (const block of finalMessage.content) {
                if (block.type === "text" && block.text) {
                  controller.enqueue(
                    encoder.encode(
                      sseEncode({ type: "text_delta", content: block.text })
                    )
                  );
                }
              }
            }
            break;
          }

          // Execute tool calls
          const toolResults: ToolResultBlockParam[] = [];
          for (const toolBlock of collectedToolBlocks) {
            const result = await executeToolCall(
              toolBlock.name,
              toolBlock.input
            );

            toolResults.push(buildToolResult(toolBlock.id, result));

            controller.enqueue(
              encoder.encode(
                sseEncode({
                  type: "tool_result",
                  tool: toolBlock.name,
                  summary:
                    result.length > 200
                      ? result.slice(0, 200) + "..."
                      : result,
                })
              )
            );
          }

          // Build conversation history with assistant response + tool results
          const assistantContentParams: ContentBlockParam[] =
            finalMessage.content.map(contentBlockToParam);

          conversationMessages = [
            ...conversationMessages,
            { role: "assistant", content: assistantContentParams },
            { role: "user", content: toolResults },
          ];
        }

        controller.enqueue(encoder.encode(sseEncode({ type: "done" })));
        controller.close();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error interno del agente.";
        controller.enqueue(
          encoder.encode(sseEncode({ type: "error", message }))
        );
        controller.enqueue(encoder.encode(sseEncode({ type: "done" })));
        controller.close();
      }
    },
  });
}

// ---- Non-streaming handler ----

async function handleNonStreaming(
  messages: MessageParam[]
): Promise<{ role: "assistant"; content: string }> {
  let conversationMessages: MessageParam[] = [...messages];
  let iterations = 0;

  while (iterations < MAX_TOOL_ITERATIONS) {
    iterations += 1;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: conversationMessages,
      tools: agentTools,
    });

    const hasToolUse = response.content.some(
      (block) => block.type === "tool_use"
    );

    if (!hasToolUse || response.stop_reason !== "tool_use") {
      const textContent = response.content
        .filter(
          (block): block is ContentBlock & { type: "text"; text: string } =>
            block.type === "text"
        )
        .map((block) => block.text)
        .join("\n");

      return { role: "assistant", content: textContent };
    }

    // Build assistant content for conversation history
    const assistantContentParams: ContentBlockParam[] =
      response.content.map(contentBlockToParam);

    // Execute tool calls
    const toolResults: ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === "tool_use") {
        const result = await executeToolCall(
          block.name,
          block.input as Record<string, unknown>
        );
        toolResults.push(buildToolResult(block.id, result));
      }
    }

    conversationMessages = [
      ...conversationMessages,
      { role: "assistant", content: assistantContentParams },
      { role: "user", content: toolResults },
    ];
  }

  return {
    role: "assistant",
    content:
      "Se alcanzó el límite máximo de iteraciones del agente. Por favor, reformula tu consulta.",
  };
}

// ---- Route handler ----

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        error:
          "Límite de solicitudes excedido. Intenta de nuevo en una hora.",
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la solicitud inválido." },
      { status: 400 }
    );
  }

  const parseResult = chatRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Datos de entrada inválidos.",
        details: parseResult.error.issues,
      },
      { status: 400 }
    );
  }

  const { messages, stream: shouldStream } = parseResult.data;

  const messageParams: MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    if (shouldStream === false) {
      const result = await handleNonStreaming(messageParams);
      return NextResponse.json(result);
    }

    const readableStream = await handleStreaming(messageParams);

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error interno del servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
