"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FileText, Check, CheckCheck } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { cn } from "@/lib/utils";

/* ── Conversation Script ── */

interface ScriptMessage {
  role: "user" | "agent";
  text: string;
  delay: number;
  typing?: number;
  attachment?: { filename: string; size: string };
}

interface RenderedMessage extends ScriptMessage {
  uid: string;
  time: string;
}

const SCRIPT: ScriptMessage[] = [
  {
    role: "user",
    text: "Hola, necesito el informe tributario de marzo",
    delay: 1200,
  },
  {
    role: "agent",
    text: "¡Hola Pedro! Voy a generar tu informe tributario de marzo 2026 para Don Pedro SpA. Un momento...",
    delay: 1400,
    typing: 1600,
  },
  {
    role: "agent",
    text: "",
    delay: 1000,
    typing: 2200,
    attachment: {
      filename: "Informe_Tributario_Marzo_2026.pdf",
      size: "3.2 KB",
    },
  },
  {
    role: "agent",
    text: "📊 Resumen:\n• IVA a pagar: $3.068.500\n• PPM: $398.500\n• Total F29: $3.712.000\n📅 Vence: 12 abril 2026",
    delay: 800,
    typing: 1400,
  },
  {
    role: "user",
    text: "Perfecto, envíalo también por email",
    delay: 2000,
  },
  {
    role: "agent",
    text: "✅ Enviado a pedro@donpedro.cl con PDF adjunto y firma corporativa de Cintax Consultores.",
    delay: 1200,
    typing: 1200,
  },
];

let uidCounter = 0;
function nextUid() {
  return `msg-${++uidCounter}`;
}

function currentTime(): string {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* ── Typing Indicator ── */

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
      className="flex justify-start"
    >
      <div className="rounded-xl rounded-bl-sm bg-[#1F2C34] px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-[7px] w-[7px] rounded-full bg-[#8696A0]"
              animate={{ opacity: [0.4, 1, 0.4], y: [0, -3, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── PDF Attachment ── */

function PDFAttachment({ filename, size }: { filename: string; size: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden rounded-lg"
    >
      <div className="flex items-center gap-3 bg-[#0F172A]/80 px-3 py-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] shadow-[0_0_12px_rgba(245,158,11,0.3)]">
          <FileText className="h-5 w-5 text-[#0F172A]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-[#E9EDEF]">{filename}</p>
          <p className="text-[10px] text-[#8696A0]">PDF · {size} · Cintax</p>
        </div>
        {/* Download arrow */}
        <svg className="h-4 w-4 shrink-0 text-[#8696A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-[#F59E0B] via-[#8B5CF6] to-[#F59E0B]" />
    </motion.div>
  );
}

/* ── Chat Bubble ── */

function ChatBubble({ message }: { message: RenderedMessage }) {
  const isUser = message.role === "user";
  const hasContent = message.text || message.attachment;

  if (!hasContent) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[82%] rounded-xl px-2.5 py-2",
          isUser ? "rounded-br-sm bg-[#005C4B]" : "rounded-bl-sm bg-[#1F2C34]"
        )}
      >
        {message.attachment && (
          <div className="mb-1.5">
            <PDFAttachment filename={message.attachment.filename} size={message.attachment.size} />
          </div>
        )}
        {message.text && (
          <p className="whitespace-pre-line px-1 text-[13px] leading-[1.45] text-[#E9EDEF]">
            {message.text}
          </p>
        )}
        <div className="mt-0.5 flex items-center justify-end gap-1 px-1">
          <span className="text-[10px] text-[#8696A0]/70">{message.time}</span>
          {isUser ? (
            <CheckCheck className="h-[14px] w-[14px] text-[#53BDEB]" />
          ) : (
            <Check className="h-3 w-3 text-[#8696A0]/60" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Animated Phone ── */

function AnimatedPhone() {
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Main sequencer
  useEffect(() => {
    if (!isInView || index >= SCRIPT.length) return;
    clearTimer();

    const msg = SCRIPT[index];

    timerRef.current = setTimeout(() => {
      // If agent message with typing, show indicator first
      if (msg.role === "agent" && msg.typing && msg.typing > 0) {
        setTyping(true);
        timerRef.current = setTimeout(() => {
          setTyping(false);
          const rendered: RenderedMessage = { ...msg, uid: nextUid(), time: currentTime() };
          setMessages((prev) => [...prev, rendered]);
          setIndex((prev) => prev + 1);
        }, msg.typing);
      } else {
        const rendered: RenderedMessage = { ...msg, uid: nextUid(), time: currentTime() };
        setMessages((prev) => [...prev, rendered]);
        setIndex((prev) => prev + 1);
      }
    }, msg.delay);

    return clearTimer;
  }, [isInView, index, clearTimer]);

  // Auto-scroll on new message or typing
  useEffect(() => {
    if (chatRef.current) {
      requestAnimationFrame(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages, typing]);

  // Loop: reset after conversation finishes
  useEffect(() => {
    if (index >= SCRIPT.length && !typing) {
      timerRef.current = setTimeout(() => {
        setMessages([]);
        setIndex(0);
        setCycle((c) => c + 1);
      }, 4500);
      return clearTimer;
    }
  }, [index, typing, clearTimer]);

  return (
    <div ref={containerRef}>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "relative mx-auto w-full max-w-[340px]",
          "rounded-[40px] border-[3px] border-[#2A2A3E] bg-[#0B1120]",
          "overflow-hidden",
          "shadow-[0_0_80px_rgba(245,158,11,0.06),0_25px_50px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Notch */}
        <div className="mx-auto mt-2 h-5 w-28 rounded-full bg-[#1a1a2e]" />

        {/* Header */}
        <div className="mt-2 flex items-center gap-3 bg-[#1F2C34] px-4 py-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706]">
              <span className="text-xs font-bold text-[#0F172A]">CX</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#1F2C34] bg-[#25D366]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#E9EDEF]">Asistente Cintax</p>
            <AnimatePresence mode="wait">
              {typing ? (
                <motion.p
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-[#25D366]"
                >
                  escribiendo...
                </motion.p>
              ) : (
                <motion.p
                  key="online"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-[#8696A0]"
                >
                  en l&iacute;nea
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat area */}
        <div
          ref={chatRef}
          className="flex h-[380px] flex-col gap-1.5 overflow-y-auto px-2.5 py-3"
          style={{
            scrollbarWidth: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.012'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        >
          {/* Date chip */}
          <div className="mb-1 flex justify-center">
            <span className="rounded-md bg-[#182229] px-3 py-0.5 text-[11px] text-[#8696A0] shadow-sm">
              Hoy
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <ChatBubble key={`${cycle}-${msg.uid}`} message={msg} />
            ))}
            {typing && <TypingIndicator key={`typing-${cycle}-${index}`} />}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 bg-[#1F2C34] px-3 py-2.5">
          <div className="flex-1 rounded-full bg-[#2A3942] px-4 py-2 text-xs text-[#8696A0]">
            Escribe un mensaje...
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
              <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.239 1.816-13.239 1.817-.011 7.912z" />
            </svg>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto mb-2 mt-1 h-1 w-24 rounded-full bg-[#333]" />
      </motion.div>
    </div>
  );
}

/* ── Feature Pills ── */

const features = [
  { label: "Informes PDF", icon: "📄" },
  { label: "Envío Email", icon: "📧" },
  { label: "WhatsApp", icon: "💬" },
  { label: "Firma corporativa", icon: "✍️" },
];

/* ── Main Component ── */

export default function DemoWhatsApp() {
  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8" delay={0.1}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Left column */}
        <div className="flex flex-col justify-center lg:w-[40%]">
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-widest text-primary">
            CANAL WHATSAPP
          </span>

          <h2 className="mb-4 font-heading text-[32px] font-bold leading-tight text-foreground">
            Informes profesionales
            <br />
            <span className="text-primary">directo a WhatsApp</span>
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
            El agente genera informes tributarios, financieros y laborales en
            PDF con firma corporativa y los envía directamente al WhatsApp
            del cliente. También por email con diseño profesional.
          </p>

          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <motion.div
                key={f.label}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full border border-[#1E293B] bg-[#0F172A]/60 px-4 py-2 backdrop-blur-sm"
              >
                <span className="text-sm">{f.icon}</span>
                <span className="font-mono text-xs text-muted-foreground">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex justify-center lg:w-[60%]">
          <AnimatedPhone />
        </div>
      </div>
    </SectionWrapper>
  );
}
