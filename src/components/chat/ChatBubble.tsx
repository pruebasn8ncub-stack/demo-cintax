"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatBubble({
  role,
  content,
  isStreaming = false,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div
        className={cn(
          "flex max-w-[85%] gap-2.5",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Bot icon for assistant messages */}
        {!isUser && (
          <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1E293B] ring-1 ring-[#334155]">
            <Bot size={20} className="text-[#94A3B8]" />
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "border-l-2 border-[#F59E0B] bg-[#F59E0B]/10 text-[#F8FAFC]"
              : "bg-[#1E293B] text-[#F8FAFC]"
          )}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
            {isStreaming && (
              <span className="ml-0.5 inline-block animate-[typing-cursor_1s_step-end_infinite] text-[#F59E0B]">
                ▊
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
