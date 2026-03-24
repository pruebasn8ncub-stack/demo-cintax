"use client";

import { useReducer, useRef, useCallback, useEffect } from "react";
import { Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import ToolIndicator from "@/components/chat/ToolIndicator";

/* ── Types ── */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  activeTool: string | null;
  error: string | null;
  messageCount: number;
}

type ChatAction =
  | { type: "ADD_MESSAGE"; message: Message }
  | { type: "APPEND_STREAM"; content: string }
  | { type: "TOOL_START"; tool: string }
  | { type: "TOOL_RESULT"; tool: string }
  | { type: "SET_ERROR"; error: string }
  | { type: "FINISH_STREAM" };

/* ── Reducer ── */

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.message],
        isStreaming: action.message.isStreaming ?? false,
        error: null,
        messageCount: state.messageCount + (action.message.role === "user" ? 1 : 0),
      };

    case "APPEND_STREAM":
      return {
        ...state,
        messages: state.messages.map((msg, idx) =>
          idx === state.messages.length - 1
            ? { ...msg, content: msg.content + action.content }
            : msg
        ),
      };

    case "TOOL_START":
      return { ...state, activeTool: action.tool };

    case "TOOL_RESULT":
      return { ...state, activeTool: null };

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        isStreaming: false,
        activeTool: null,
        messages: state.messages.map((msg, idx) =>
          idx === state.messages.length - 1
            ? { ...msg, isStreaming: false }
            : msg
        ),
      };

    case "FINISH_STREAM":
      return {
        ...state,
        isStreaming: false,
        activeTool: null,
        messages: state.messages.map((msg, idx) =>
          idx === state.messages.length - 1
            ? { ...msg, isStreaming: false }
            : msg
        ),
      };

    default:
      return state;
  }
}

const INITIAL_STATE: ChatState = {
  messages: [],
  isStreaming: false,
  activeTool: null,
  error: null,
  messageCount: 0,
};

/* ── SSE Event Types ── */

interface TextDeltaEvent {
  type: "text_delta";
  content: string;
}

interface ToolStartEvent {
  type: "tool_start";
  tool: string;
}

interface ToolResultEvent {
  type: "tool_result";
  tool: string;
  summary: string;
}

interface DoneEvent {
  type: "done";
}

type SSEEvent = TextDeltaEvent | ToolStartEvent | ToolResultEvent | DoneEvent;

/* ── Component ── */

interface ChatInterfaceProps {
  suggestedPrompts?: string[];
  className?: string;
}

export default function ChatInterface({
  suggestedPrompts,
  className,
}: ChatInterfaceProps) {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef(0);

  /* Auto-scroll to bottom on new messages / stream chunks */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [state.messages, state.activeTool]);

  /* Send message logic */
  const sendMessage = useCallback(
    async (content: string) => {
      if (state.isStreaming) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };
      dispatch({ type: "ADD_MESSAGE", message: userMessage });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        isStreaming: true,
      };
      dispatch({ type: "ADD_MESSAGE", message: assistantMessage });

      const allMessages = [
        ...state.messages,
        userMessage,
      ].map((m) => ({ role: m.role, content: m.content }));

      const attemptFetch = async (isRetry: boolean) => {
        try {
          const response = await fetch("/api/agent/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: allMessages }),
          });

          if (!response.ok || !response.body) {
            throw new Error(`HTTP ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ")) continue;

              const jsonStr = trimmed.slice(6);
              if (!jsonStr) continue;

              try {
                const event = JSON.parse(jsonStr) as SSEEvent;

                switch (event.type) {
                  case "text_delta":
                    dispatch({ type: "APPEND_STREAM", content: event.content });
                    break;
                  case "tool_start":
                    dispatch({ type: "TOOL_START", tool: event.tool });
                    break;
                  case "tool_result":
                    dispatch({ type: "TOOL_RESULT", tool: event.tool });
                    break;
                  case "done":
                    dispatch({ type: "FINISH_STREAM" });
                    break;
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }

          // Handle remaining buffer
          if (buffer.trim().startsWith("data: ")) {
            try {
              const event = JSON.parse(buffer.trim().slice(6)) as SSEEvent;
              if (event.type === "done") {
                dispatch({ type: "FINISH_STREAM" });
              }
            } catch {
              // Ignore
            }
          }

          retryCountRef.current = 0;
        } catch (err) {
          if (!isRetry && retryCountRef.current === 0) {
            retryCountRef.current = 1;
            setTimeout(() => {
              attemptFetch(true);
            }, 2000);
          } else {
            retryCountRef.current = 0;
            dispatch({
              type: "SET_ERROR",
              error:
                err instanceof Error
                  ? err.message
                  : "Error de conexión. Intenta de nuevo.",
            });
          }
        }
      };

      attemptFetch(false);
    },
    [state.messages, state.isStreaming]
  );

  const showSuggestions =
    suggestedPrompts &&
    suggestedPrompts.length > 0 &&
    state.messages.length === 0;

  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0B1120]/90 backdrop-blur-xl", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706]">
              <Bot className="h-5 w-5 text-[#0F172A]" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0B1120] bg-[#22C55E]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F8FAFC]">Asistente Cintax</p>
            <p className="text-[10px] text-[#64748B]">
              {state.isStreaming ? "Respondiendo..." : "4 herramientas disponibles"}
            </p>
          </div>
        </div>
        <div className="rounded-full bg-[#1E293B] px-2.5 py-0.5 text-[10px] font-mono text-[#64748B] ring-1 ring-[#334155]">
          {state.messageCount}/30
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto p-4"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Empty state */}
        {state.messages.length === 0 && !showSuggestions && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F59E0B]/10 ring-1 ring-[#F59E0B]/20">
              <Sparkles className="h-7 w-7 text-[#F59E0B]" />
            </div>
            <p className="text-sm font-medium text-[#F8FAFC]">¿En qué puedo ayudarte?</p>
            <p className="mt-1 max-w-[240px] text-xs text-[#64748B]">
              Consultas tributarias, cálculos de impuestos, informes y más.
            </p>
          </div>
        )}

        {state.messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={msg.isStreaming}
          />
        ))}

        <ToolIndicator
          toolName={state.activeTool ?? ""}
          isActive={state.activeTool !== null}
        />

        {state.error && (
          <div className="mx-auto max-w-[85%] rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5 px-4 py-2.5 text-center text-xs text-[#EF4444]">
            {state.error}
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 border-t border-[#1E293B] px-4 py-3">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-3.5 py-1.5 text-[11px] text-[#F59E0B] transition-all hover:border-[#F59E0B]/40 hover:bg-[#F59E0B]/10 hover:shadow-[0_0_8px_rgba(245,158,11,0.1)]"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[#1E293B] p-3">
        <ChatInput onSend={sendMessage} disabled={state.isStreaming} />
      </div>
    </div>
  );
}
