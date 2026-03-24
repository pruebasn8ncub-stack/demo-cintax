"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        isUser
          ? "bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]"
          : "bg-gradient-to-br from-[#F59E0B] to-[#D97706]"
      }`}>
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-[#0F172A]" />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? "rounded-tr-sm bg-[#F59E0B]/10 border border-[#F59E0B]/20"
          : "rounded-tl-sm bg-[#1E293B] border border-[#334155]/50"
      }`}>
        {/* Role label */}
        <p className={`mb-1 text-[10px] font-medium uppercase tracking-wider ${
          isUser ? "text-[#F59E0B]/60 text-right" : "text-[#F59E0B]/60"
        }`}>
          {isUser ? "Tú" : "Asistente Cintax"}
        </p>

        {/* Content */}
        <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#F8FAFC]">
          {content}
          {isStreaming && (
            <motion.span
              className="ml-0.5 inline-block h-4 w-[2px] translate-y-[2px] bg-[#F59E0B]"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
