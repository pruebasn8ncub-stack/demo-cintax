"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "agent";
  text: string;
}

const MESSAGES: Message[] = [
  {
    role: "user",
    text: "Hola, necesito saber mis obligaciones tributarias de este mes",
  },
  {
    role: "agent",
    text: "¡Hola! Tus obligaciones para marzo 2026:\n• F29 (IVA+PPM): vence 12 marzo\n• Cotizaciones: vence 13 marzo\n• Libro remuneraciones: antes del 30",
  },
  {
    role: "user",
    text: "Envíame un reporte por correo",
  },
  {
    role: "agent",
    text: "✅ Listo, te envié el reporte a pedro@donpedro.cl",
  },
];

const QR_VALUE =
  "https://wa.me/56912345678?text=Hola+soy+cliente+de+Don+Pedro";

function ChatBubble({
  message,
  index,
}: {
  message: Message;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const isUser = message.role === "user";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 12, scale: 0.95 }
      }
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.8,
      }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line",
          isUser
            ? "rounded-br-sm bg-[#005C4B] text-white"
            : "rounded-bl-sm bg-[#1F2C34] text-[#E9EDEF]"
        )}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

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
            Tu agente en WhatsApp
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
            Los clientes de Don Pedro interactúan con el agente directamente
            desde WhatsApp. Consultas tributarias, reportes y recordatorios,
            todo en tiempo real.
          </p>

          {/* QR Code */}
          <div className="flex flex-col items-start gap-3">
            <div className="rounded-xl bg-white p-3">
              <QRCodeSVG
                value={QR_VALUE}
                size={140}
                bgColor="#FFFFFF"
                fgColor="#0F172A"
                level="M"
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Escanea para probar en tu celular
            </span>
          </div>
        </div>

        {/* Right column — phone mockup */}
        <div className="lg:w-[60%] flex justify-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "relative mx-auto w-full max-w-[320px]",
              "rounded-[40px] border-4 border-[#333] bg-[#0B1120]",
              "overflow-hidden shadow-2xl"
            )}
          >
            {/* Notch */}
            <div className="mx-auto mt-2 h-5 w-28 rounded-full bg-[#1a1a2e]" />

            {/* WhatsApp header */}
            <div className="mt-2 flex items-center gap-3 bg-[#1F2C34] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
                <span className="text-sm font-bold text-white">DP</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#E9EDEF]">
                  Don Pedro AI
                </p>
                <p className="text-[11px] text-[#8696A0]">en línea</p>
              </div>
            </div>

            {/* Chat area */}
            <div
              className="flex min-h-[340px] flex-col gap-2 px-3 py-4"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            >
              {MESSAGES.map((msg, i) => (
                <ChatBubble key={i} message={msg} index={i} />
              ))}
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
      </div>
    </SectionWrapper>
  );
}
