"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FileText, Check, CheckCheck, Download } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

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
    delay: 1000,
  },
  {
    role: "agent",
    text: "¡Hola Pedro! Voy a generar tu informe tributario de marzo 2026. Un momento...",
    delay: 1200,
    typing: 1400,
  },
  {
    role: "agent",
    text: "",
    delay: 800,
    typing: 2000,
    attachment: {
      filename: "Informe_Tributario_Marzo_2026.pdf",
      size: "3.2 KB",
    },
  },
  {
    role: "agent",
    text: "📊 Resumen:\n• IVA a pagar: $3.068.500\n• PPM: $398.500\n• Total F29: $3.712.000\n📅 Vence: 12 abril 2026",
    delay: 600,
    typing: 1200,
  },
  {
    role: "user",
    text: "Perfecto, envíalo también por email",
    delay: 1800,
  },
  {
    role: "agent",
    text: "✅ Enviado a pedro@donpedro.cl con PDF adjunto y firma corporativa de Cintax.",
    delay: 1000,
    typing: 1000,
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="flex justify-start"
    >
      <div className="rounded-xl rounded-bl-sm bg-[#1F2C34] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-[6px] w-[6px] rounded-full bg-[#8696A0]"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.12,
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
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-lg"
    >
      <div className="flex items-center gap-2.5 bg-[#0F172A]/80 px-2.5 py-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] shadow-[0_0_10px_rgba(245,158,11,0.25)]">
          <FileText className="h-4 w-4 text-[#0F172A]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium leading-tight text-[#E9EDEF]">{filename}</p>
          <p className="text-[9px] leading-tight text-[#8696A0]">PDF · {size} · Cintax</p>
        </div>
        <Download className="h-3.5 w-3.5 shrink-0 text-[#8696A0]/60" />
      </div>
      <div className="h-[2px] bg-gradient-to-r from-[#F59E0B] via-[#8B5CF6] to-[#F59E0B]" />
    </motion.div>
  );
}

/* ── Chat Bubble ── */

function ChatBubble({ message }: { message: RenderedMessage }) {
  const isUser = message.role === "user";
  if (!message.text && !message.attachment) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-2.5 py-1.5 ${
          isUser ? "rounded-br-sm bg-[#005C4B]" : "rounded-bl-sm bg-[#1F2C34]"
        }`}
      >
        {message.attachment && (
          <div className="mb-1">
            <PDFAttachment filename={message.attachment.filename} size={message.attachment.size} />
          </div>
        )}
        {message.text && (
          <p className="whitespace-pre-line text-[12px] leading-[1.4] text-[#E9EDEF]">
            {message.text}
          </p>
        )}
        <div className="mt-0.5 flex items-center justify-end gap-1">
          <span className="text-[9px] text-[#8696A0]/60">{message.time}</span>
          {isUser ? (
            <CheckCheck className="h-3 w-3 text-[#53BDEB]" />
          ) : (
            <Check className="h-2.5 w-2.5 text-[#8696A0]/50" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Phone Mockup ── */

function AnimatedPhone() {
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isInView || index >= SCRIPT.length) return;
    clearTimer();

    const msg = SCRIPT[index];

    timerRef.current = setTimeout(() => {
      if (msg.role === "agent" && msg.typing && msg.typing > 0) {
        setTyping(true);
        timerRef.current = setTimeout(() => {
          setTyping(false);
          setMessages((prev) => [...prev, { ...msg, uid: nextUid(), time: currentTime() }]);
          setIndex((prev) => prev + 1);
        }, msg.typing);
      } else {
        setMessages((prev) => [...prev, { ...msg, uid: nextUid(), time: currentTime() }]);
        setIndex((prev) => prev + 1);
      }
    }, msg.delay);

    return clearTimer;
  }, [isInView, index, clearTimer]);

  useEffect(() => {
    if (chatRef.current) {
      requestAnimationFrame(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages, typing]);

  useEffect(() => {
    if (index >= SCRIPT.length && !typing) {
      timerRef.current = setTimeout(() => {
        setMessages([]);
        setIndex(0);
        setCycle((c) => c + 1);
      }, 4000);
      return clearTimer;
    }
  }, [index, typing, clearTimer]);

  return (
    <div ref={containerRef} className="flex justify-center">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[300px] rounded-[36px] border-[3px] border-[#2A2A3E] bg-[#0B1120] shadow-[0_0_60px_rgba(245,158,11,0.05),0_20px_40px_rgba(0,0,0,0.4)]"
      >
        {/* Notch */}
        <div className="mx-auto mt-1.5 h-4 w-24 rounded-full bg-[#111827]" />

        {/* Header */}
        <div className="mt-1 flex items-center gap-2.5 bg-[#1F2C34] px-3 py-2.5">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706]">
              <span className="text-[10px] font-bold text-[#0F172A]">CX</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-[#1F2C34] bg-[#25D366]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold leading-tight text-[#E9EDEF]">Asistente Cintax</p>
            <AnimatePresence mode="wait">
              {typing ? (
                <motion.p
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] leading-tight text-[#25D366]"
                >
                  escribiendo...
                </motion.p>
              ) : (
                <motion.p
                  key="online"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] leading-tight text-[#8696A0]"
                >
                  en l&iacute;nea
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat */}
        <div
          ref={chatRef}
          className="flex h-[340px] flex-col gap-1 overflow-y-auto px-2 py-2"
          style={{
            scrollbarWidth: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.01'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        >
          {/* Date chip */}
          <div className="mb-1 flex justify-center">
            <span className="rounded-md bg-[#182229] px-2.5 py-0.5 text-[10px] text-[#8696A0]">Hoy</span>
          </div>

          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <ChatBubble key={`${cycle}-${msg.uid}`} message={msg} />
            ))}
            {typing && <TypingIndicator key={`typing-${cycle}-${index}`} />}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="flex items-center gap-1.5 bg-[#1F2C34] px-2.5 py-2">
          <div className="flex-1 rounded-full bg-[#2A3942] px-3 py-1.5 text-[10px] text-[#8696A0]">
            Escribe un mensaje...
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="currentColor">
              <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.239 1.816-13.239 1.817-.011 7.912z" />
            </svg>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto mb-1.5 mt-1 h-1 w-20 rounded-full bg-[#333]" />
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

/* ── Main ── */

export default function DemoWhatsApp() {
  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8" delay={0.1}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
        {/* Left */}
        <div className="flex flex-col justify-center lg:w-[42%]">
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

        {/* Right */}
        <div className="lg:w-[58%]">
          <AnimatedPhone />
        </div>
      </div>
    </SectionWrapper>
  );
}
