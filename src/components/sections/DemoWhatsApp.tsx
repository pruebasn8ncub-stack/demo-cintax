"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FileText, Check, CheckCheck } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { cn } from "@/lib/utils";

/* ── Conversation Script ── */

interface Message {
  role: "user" | "agent";
  text: string;
  delay: number; // ms before this message appears
  typing?: number; // ms of typing indicator
  attachment?: {
    type: "pdf";
    filename: string;
    size: string;
  };
}

const CONVERSATION: Message[] = [
  {
    role: "user",
    text: "Hola, necesito el informe tributario de marzo 2026",
    delay: 1200,
    typing: 0,
  },
  {
    role: "agent",
    text: "¡Hola! Voy a generar tu informe tributario de marzo 2026 para Restaurante Don Pedro SpA. Dame un momento...",
    delay: 1800,
    typing: 1500,
  },
  {
    role: "agent",
    text: "",
    delay: 2500,
    typing: 2000,
    attachment: {
      type: "pdf",
      filename: "Informe_Tributario_Marzo_2026.pdf",
      size: "3.2 KB",
    },
  },
  {
    role: "agent",
    text: "📊 Resumen del informe:\n\n• IVA a pagar: $3.068.500\n• PPM (0.25%): $398.500\n• Total F29: $3.712.000\n\n📅 Vencimiento: 12 de abril 2026\n\n¿Necesitas que lo envíe también por email?",
    delay: 1200,
    typing: 1800,
  },
  {
    role: "user",
    text: "Sí, envíalo a pedro@donpedro.cl",
    delay: 2200,
    typing: 0,
  },
  {
    role: "agent",
    text: "✅ Informe enviado a pedro@donpedro.cl con el PDF adjunto y firma de Cintax Consultores.\n\n¿Algo más en que pueda ayudarte?",
    delay: 1600,
    typing: 1400,
  },
];

/* ── Typing Indicator ── */

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex justify-start"
    >
      <div className="rounded-xl rounded-bl-sm bg-[#1F2C34] px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-[#8696A0]"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
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

function PDFAttachment({
  filename,
  size,
}: {
  filename: string;
  size: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden rounded-lg"
    >
      {/* PDF Preview area */}
      <div className="relative flex items-center gap-3 bg-[#0F172A]/80 px-3 py-3">
        {/* PDF icon with gold accent */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706]">
          <FileText className="h-5 w-5 text-[#0F172A]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-[#E9EDEF]">
            {filename}
          </p>
          <p className="text-[10px] text-[#8696A0]">
            PDF · {size} · Cintax Consultores
          </p>
        </div>
      </div>
      {/* Gold bottom accent */}
      <div className="h-[2px] bg-gradient-to-r from-[#F59E0B] via-[#8B5CF6] to-[#F59E0B]" />
    </motion.div>
  );
}

/* ── Chat Bubble ── */

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[82%] rounded-xl px-3 py-2",
          isUser
            ? "rounded-br-sm bg-[#005C4B]"
            : "rounded-bl-sm bg-[#1F2C34]"
        )}
      >
        {message.attachment && (
          <div className="mb-2">
            <PDFAttachment
              filename={message.attachment.filename}
              size={message.attachment.size}
            />
          </div>
        )}
        {message.text && (
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-[#E9EDEF]">
            {message.text}
          </p>
        )}
        {/* Time + check marks */}
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-[#8696A0]">{timeStr}</span>
          {isUser && (
            <CheckCheck className="h-3.5 w-3.5 text-[#53BDEB]" />
          )}
          {!isUser && (
            <Check className="h-3 w-3 text-[#8696A0]" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Animated Phone ── */

function AnimatedPhone() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || currentIndex >= CONVERSATION.length) return;

    const msg = CONVERSATION[currentIndex];

    const delayTimer = setTimeout(() => {
      if (msg.typing && msg.typing > 0 && msg.role === "agent") {
        setIsTyping(true);
        const typingTimer = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages((prev) => [...prev, msg]);
          setCurrentIndex((prev) => prev + 1);
        }, msg.typing);
        return () => clearTimeout(typingTimer);
      } else {
        setVisibleMessages((prev) => [...prev, msg]);
        setCurrentIndex((prev) => prev + 1);
      }
    }, msg.delay);

    return () => clearTimeout(delayTimer);
  }, [isInView, currentIndex]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  // Loop the conversation
  useEffect(() => {
    if (currentIndex >= CONVERSATION.length && !isTyping) {
      const resetTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex, isTyping]);

  return (
    <div ref={containerRef}>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "relative mx-auto w-full max-w-[340px]",
          "rounded-[40px] border-[3px] border-[#2A2A3E] bg-[#0B1120]",
          "overflow-hidden",
          "shadow-[0_0_60px_rgba(245,158,11,0.08),0_20px_60px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Notch */}
        <div className="mx-auto mt-2 h-5 w-28 rounded-full bg-[#1a1a2e]" />

        {/* WhatsApp header */}
        <div className="mt-2 flex items-center gap-3 bg-[#1F2C34] px-4 py-3">
          {/* Avatar with gold ring */}
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706]">
              <span className="text-xs font-bold text-[#0F172A]">CX</span>
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#1F2C34] bg-[#25D366]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#E9EDEF]">
              Asistente Cintax
            </p>
            <motion.p
              className="text-[11px] text-[#25D366]"
              animate={isTyping ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
              transition={isTyping ? { duration: 1, repeat: Infinity } : {}}
            >
              {isTyping ? "escribiendo..." : "en línea"}
            </motion.p>
          </div>
        </div>

        {/* Chat area */}
        <div
          ref={chatRef}
          className="flex h-[380px] flex-col gap-2 overflow-y-auto px-3 py-3 scroll-smooth"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        >
          {/* Date chip */}
          <div className="mb-2 flex justify-center">
            <span className="rounded-lg bg-[#1F2C34]/80 px-3 py-1 text-[11px] text-[#8696A0]">
              Hoy
            </span>
          </div>

          <AnimatePresence>
            {visibleMessages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
            {isTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 bg-[#1F2C34] px-3 py-3">
          <div className="flex-1 rounded-full bg-[#2A3942] px-4 py-2 text-xs text-[#8696A0]">
            Escribe un mensaje...
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-white"
              fill="currentColor"
            >
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
  { label: "Datos reales", icon: "📊" },
];

/* ── Main Component ── */

export default function DemoWhatsApp() {
  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8" delay={0.1}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Left column — description */}
        <div className="flex flex-col justify-center lg:w-[40%]">
          <span
            className={cn(
              "mb-4 inline-block font-mono text-xs uppercase tracking-widest text-primary"
            )}
          >
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

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <motion.div
                key={f.label}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full border border-[#1E293B] bg-[#0F172A]/60 px-4 py-2"
              >
                <span className="text-sm">{f.icon}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {f.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column — animated phone */}
        <div className="flex justify-center lg:w-[60%]">
          <AnimatedPhone />
        </div>
      </div>
    </SectionWrapper>
  );
}
