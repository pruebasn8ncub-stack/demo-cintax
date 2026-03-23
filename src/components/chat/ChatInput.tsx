"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { motion, useAnimation } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  disabled,
  placeholder = "Escribe tu consulta...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const shakeControls = useAnimation();

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      shakeControls.start({
        x: [0, -4, 4, -4, 0],
        transition: { duration: 0.3 },
      });
      return;
    }
    onSend(trimmed);
    setValue("");
  }, [value, onSend, shakeControls]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !disabled) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend, disabled]
  );

  return (
    <motion.div
      className="glass flex items-center gap-2 p-2"
      animate={shakeControls}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-transparent px-3 py-2 text-sm text-[#F8FAFC] outline-none",
          "placeholder:text-[#94A3B8]",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "text-[#F59E0B] hover:bg-[#F59E0B]/10"
        )}
      >
        {disabled ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
      </button>
    </motion.div>
  );
}
