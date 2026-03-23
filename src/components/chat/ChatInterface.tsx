"use client";

import { useReducer, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import GlassCard from "@/components/shared/GlassCard";
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
    <GlassCard className={cn("relative flex max-h-[70vh] flex-col", className)}>
      {/* Message count badge */}
      <div className="absolute right-3 top-3 z-10 rounded-full bg-[#1E293B] px-2.5 py-0.5 text-xs text-[#94A3B8] ring-1 ring-[#334155]">
        {state.messageCount}/30
      </div>

      {/* Scrollable message area */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-4 pt-10"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#334155 transparent",
        }}
      >
        {state.messages.length === 0 && !showSuggestions && (
          <p className="py-12 text-center text-sm text-[#94A3B8]">
            Inicia una conversación con el agente.
          </p>
        )}

        {state.messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={msg.isStreaming}
          />
        ))}

        {/* Tool indicator */}
        <ToolIndicator
          toolName={state.activeTool ?? ""}
          isActive={state.activeTool !== null}
        />

        {/* Error message */}
        {state.error && (
          <div className="mx-auto max-w-[85%] rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-2 text-center text-sm text-[#EF4444]">
            {state.error}
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 border-t border-[#334155]/50 px-4 py-3">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-3.5 py-1.5 text-xs text-[#F59E0B] transition-colors hover:bg-[#F59E0B]/15"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat input */}
      <div className="border-t border-[#334155]/50 p-3">
        <ChatInput
          onSend={sendMessage}
          disabled={state.isStreaming}
        />
      </div>
    </GlassCard>
  );
}
