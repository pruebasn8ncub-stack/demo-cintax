"use client";

import SectionWrapper from "@/components/shared/SectionWrapper";
import ChatInterface from "@/components/chat/ChatInterface";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "¿Cuándo vence la declaración de IVA?",
  "Genera un reporte de mis ventas del mes",
  "Agenda una reunión con mi contador",
  "¿Cuánto PPM debo pagar este mes?",
  "Envíame un resumen por correo",
  "¿Cuál es el estado de mi trámite en el SII?",
];

export default function DemoChat() {
  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8" delay={0.1}>
      <div
        id="demo-chat"
        className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:gap-12"
      >
        {/* Left column — description */}
        <div className="flex flex-col justify-center lg:w-[40%]">
          <span
            className={cn(
              "mb-4 inline-block font-mono text-xs uppercase tracking-widest text-primary"
            )}
          >
            DEMO EN VIVO
          </span>

          <h2 className="mb-4 font-heading text-[32px] font-bold leading-tight text-foreground">
            Pruébalo en vivo
          </h2>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Un agente de IA real conectado a Claude, equipado con 6 herramientas
            especializadas para gestión tributaria y contable.
          </p>
        </div>

        {/* Right column — chat interface */}
        <div className="lg:w-[60%]">
          <ChatInterface
            suggestedPrompts={SUGGESTED_PROMPTS}
            className="h-[70vh]"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
