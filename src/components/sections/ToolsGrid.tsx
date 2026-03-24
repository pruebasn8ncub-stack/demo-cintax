"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  Calculator,
  ClipboardList,
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";

import { ToolShowcase } from "@/remotion/ToolShowcase";

const RemotionPlayer = dynamic(
  () => import("@remotion/player").then((mod) => ({ default: mod.Player })),
  { ssr: false }
);

interface Tool {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  colSpan?: boolean;
}

const TOOLS: Tool[] = [
  {
    id: "searchRegulations",
    icon: Search,
    name: "Normativa Tributaria",
    description:
      "Búsqueda en tiempo real de normativas del SII, circulares y resoluciones vigentes.",
  },
  {
    id: "calculateTax",
    icon: Calculator,
    name: "Cálculo de Impuestos",
    description:
      "Cálculo automático de IVA, PPM, impuesto a la renta y cotizaciones previsionales.",
  },
  {
    id: "checkProcedureStatus",
    icon: ClipboardList,
    name: "Estado de Trámites",
    description:
      "Consulta el estado de trámites en el SII, Tesorería y organismos públicos.",
  },
  {
    id: "generateAndSendReport",
    icon: FileText,
    name: "Informes PDF + Envío",
    description:
      "Genera informes profesionales en PDF y los envía por email y WhatsApp con firma corporativa.",
  },
];

function MiniVisual({ toolId }: { toolId: string }) {
  const baseClasses = "mt-3 h-8 w-full rounded overflow-hidden";

  switch (toolId) {
    case "searchRegulations":
      return (
        <div className={cn(baseClasses, "flex items-center gap-1 px-1")}>
          <div className="h-1.5 w-[60%] rounded-full bg-primary/20" />
          <div className="h-1.5 w-[30%] rounded-full bg-purple-500/20" />
        </div>
      );
    case "generateAndSendReport":
      return (
        <div className={cn(baseClasses, "flex items-center gap-1.5 px-1")}>
          <div className="h-5 w-4 rounded-sm bg-primary/20" />
          <div className="h-1 w-3 rounded-full bg-green-500/30" />
          <div className="h-3 w-3 rounded-full bg-green-500/20" />
          <div className="h-1 w-3 rounded-full bg-purple-500/30" />
          <div className="h-3 w-3 rounded-full bg-purple-500/20" />
        </div>
      );
    case "calculateTax":
      return (
        <div className={cn(baseClasses, "flex flex-col justify-center gap-1 px-1")}>
          <div className="flex items-center gap-1">
            <div className="h-1 w-8 rounded-full bg-green-500/20" />
            <span className="font-mono text-[9px] text-green-500/40">19%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-5 rounded-full bg-primary/20" />
            <span className="font-mono text-[9px] text-primary/40">1%</span>
          </div>
        </div>
      );
    case "checkProcedureStatus":
      return (
        <div className={cn(baseClasses, "flex items-center gap-1.5 px-1")}>
          <div className="h-2 w-2 rounded-full bg-green-500/30" />
          <div className="h-1 flex-1 rounded-full bg-green-500/10" />
        </div>
      );
    default:
      return null;
  }
}

function ToolCard({
  tool,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  tool: Tool;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.04,
      }}
      whileHover={{ scale: 1.03 }}
      className={cn(tool.colSpan && "md:col-span-2")}
      style={{
        filter: "drop-shadow(0 0 0px transparent)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter =
          "drop-shadow(0 0 12px rgba(245, 158, 11, 0.25))";
        onHover();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter =
          "drop-shadow(0 0 0px transparent)";
        onLeave();
      }}
    >
      <GlassCard hover glow="primary" className="h-full p-5">
        <tool.icon className="h-6 w-6 text-primary" />
        <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
          {tool.name}
        </h3>

        {/* Remotion ToolShowcase on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-2 overflow-hidden rounded-md"
            >
              <RemotionPlayer
                component={ToolShowcase as any}
                inputProps={{ toolIndex: index }}
                durationInFrames={60}
                fps={30}
                compositionWidth={400}
                compositionHeight={200}
                loop
                autoPlay
                controls={false}
                style={{
                  width: "100%",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
        <MiniVisual toolId={tool.id} />
      </GlassCard>
    </motion.div>
  );
}

export default function ToolsGrid() {
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);

  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8" delay={0.1}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span
            className={cn(
              "mb-4 inline-block font-mono text-xs uppercase tracking-widest text-primary"
            )}
          >
            HERRAMIENTAS
          </span>
          <h2 className="font-heading text-[32px] font-bold leading-tight text-foreground">
            4 herramientas especializadas
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Cada herramienta está diseñada para resolver tareas específicas de
            gestión tributaria y contable.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {TOOLS.map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={i}
              isHovered={hoveredTool === i}
              onHover={() => setHoveredTool(i)}
              onLeave={() => setHoveredTool(null)}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
