"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shakeControls = useAnimationControls();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      if (!trimmed) {
        shakeControls.start({
          x: [0, -3, 3, -3, 0],
          transition: { duration: 0.3 },
        });
      }
      return;
    }
    onSend(trimmed);
    setValue("");
  };

  return (
    <motion.div
      animate={shakeControls}
      className={`relative flex items-center gap-2 rounded-2xl border px-3 py-2 transition-all duration-300 ${
        isFocused
          ? "border-[#F59E0B]/40 bg-[#0F172A]/80 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
          : "border-[#334155]/50 bg-[#0F172A]/40"
      }`}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Escribe tu consulta..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none disabled:opacity-50"
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          disabled || !value.trim()
            ? "bg-[#334155]/50 text-[#64748B] cursor-not-allowed"
            : "bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-[#0F172A] hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]"
        }`}
      >
        {disabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-3.5 w-3.5" />
        )}
      </button>
    </motion.div>
  );
}
