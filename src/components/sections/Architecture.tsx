"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageCircle,
  Globe,
  Mail,
  Cpu,
  Search,
  Calculator,
  FileText,
  Calendar,
  Database,
  Send,
  Bot,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";

/* ── Data ── */

interface Channel { icon: LucideIcon; label: string; dotColor: string }
interface ToolItem { icon: LucideIcon; label: string }

const channels: Channel[] = [
  { icon: MessageCircle, label: "WhatsApp", dotColor: "#22C55E" },
  { icon: Globe, label: "Web Chat", dotColor: "#F59E0B" },
  { icon: Mail, label: "Email", dotColor: "#8B5CF6" },
];

const tools: ToolItem[] = [
  { icon: Search, label: "Normativa SII" },
  { icon: Calculator, label: "Cálculos" },
  { icon: FileText, label: "Reportes" },
  { icon: Calendar, label: "Agenda" },
  { icon: Database, label: "Datos" },
  { icon: Send, label: "Email" },
];

const techStack = ["Next.js", "Claude", "n8n", "Evolution API", "TypeScript", "Tailwind"];

/* ── Animated Dot ── */
function PulseDot({ color = "#F59E0B", size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative flex items-center justify-center" style={{ width: size * 2, height: size * 2 }}>
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ backgroundColor: color, width: size, height: size }}
      />
    </span>
  );
}

/* ── Dashed Line with traveling dot ── */
function DashedFlow({ direction = "horizontal", className }: { direction?: "horizontal" | "diagonal-up" | "diagonal-down"; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Dashed line */}
      <div
        className="absolute inset-0"
        style={{
          background: direction === "horizontal"
            ? "repeating-linear-gradient(90deg, #F59E0B 0px, #F59E0B 6px, transparent 6px, transparent 12px)"
            : undefined,
          height: direction === "horizontal" ? 2 : undefined,
          top: direction === "horizontal" ? "50%" : undefined,
          transform: direction === "horizontal" ? "translateY(-50%)" : undefined,
        }}
      />
      {/* Traveling dot */}
      <div
        className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          animation: "travel-dot 2s linear infinite",
        }}
      />
    </div>
  );
}

/* ── Main Component ── */

export default function Architecture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8">
      <style>{`
        @keyframes travel-dot {
          0% { left: 0; }
          100% { left: calc(100% - 8px); }
        }
        @keyframes dash-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 24px 0; }
        }
        .animated-dash-h {
          height: 2px;
          background: repeating-linear-gradient(90deg, #F59E0B 0px, #F59E0B 6px, transparent 6px, transparent 12px);
          animation: dash-scroll 0.8s linear infinite;
        }
        .animated-dash-h-purple {
          height: 2px;
          background: repeating-linear-gradient(90deg, #8B5CF6 0px, #8B5CF6 6px, transparent 6px, transparent 12px);
          animation: dash-scroll 0.8s linear infinite;
        }
      `}</style>

      <section id="architecture" ref={sectionRef}>
        {/* Title */}
        <h2 className="mb-14 text-center font-heading text-[28px] font-bold text-foreground sm:text-[36px]">
          Arquitectura del{" "}
          <span className="text-primary">Sistema</span>
        </h2>

        {/* ═══ DESKTOP LAYOUT ═══ */}
        <div className="mx-auto hidden max-w-6xl lg:block">
          {/* Row layout: Channels | Merge Zone | n8n | Arrow | Agent */}
          <div className="flex items-stretch gap-0">

            {/* ── LEFT: Channels ── */}
            <motion.div
              className="flex w-[220px] shrink-0 flex-col gap-3 self-center"
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
            >
              <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Canales
              </p>
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <GlassCard key={ch.label} className="flex items-center gap-3 px-4 py-3" hover>
                    <Icon className="h-5 w-5 text-foreground" />
                    <span className="font-mono text-sm text-foreground">{ch.label}</span>
                    <span className="ml-auto h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.dotColor }} />
                  </GlassCard>
                );
              })}
            </motion.div>

            {/* ── MERGE ZONE: 3 lines converge to 1 ── */}
            <motion.div
              className="flex w-[140px] shrink-0 flex-col items-stretch justify-center self-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Top branch: line from WhatsApp level angling down to center */}
              <div className="flex items-end justify-end" style={{ height: 52 }}>
                <div className="relative h-full w-full">
                  <svg viewBox="0 0 140 52" className="absolute inset-0 h-full w-full" fill="none">
                    <path d="M 0 10 Q 70 10, 130 46" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round">
                      <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
                    </path>
                    <circle r="3" fill="#22C55E">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M 0 10 Q 70 10, 130 46" />
                    </circle>
                  </svg>
                </div>
              </div>

              {/* Middle branch: straight line */}
              <div className="flex items-center" style={{ height: 24 }}>
                <div className="relative h-[2px] w-full">
                  <div className="animated-dash-h absolute inset-0" />
                  <div
                    className="absolute h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                    style={{ top: -3, animation: "travel-dot 1.8s linear infinite" }}
                  />
                </div>
              </div>

              {/* Bottom branch: line from Email level angling up to center */}
              <div className="flex items-start justify-end" style={{ height: 52 }}>
                <div className="relative h-full w-full">
                  <svg viewBox="0 0 140 52" className="absolute inset-0 h-full w-full" fill="none">
                    <path d="M 0 42 Q 70 42, 130 6" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round">
                      <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
                    </path>
                    <circle r="3" fill="#8B5CF6">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M 0 42 Q 70 42, 130 6" />
                    </circle>
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* ── Merge point + line to n8n ── */}
            <motion.div
              className="flex w-[40px] shrink-0 items-center justify-center self-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <PulseDot color="#F59E0B" size={6} />
            </motion.div>

            {/* ── CENTER: n8n ── */}
            <motion.div
              className="shrink-0 self-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.5 }}
            >
              <GlassCard glow="primary" className="flex w-[170px] flex-col items-center gap-3 px-5 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
                  <Cpu className="h-7 w-7 text-primary" />
                </div>
                <span className="font-heading text-lg font-bold text-foreground">n8n</span>
                <span className="font-mono text-[10px] text-muted-foreground">Orquestador</span>
                <div className="h-1 w-10 rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B, #8B5CF6)" }} />
              </GlassCard>
            </motion.div>

            {/* ── Arrow: n8n → Agent ── */}
            <motion.div
              className="flex flex-1 items-center self-center px-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="relative h-[2px] flex-1">
                <div className="animated-dash-h absolute inset-0" />
                <div
                  className="absolute h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(245,158,11,0.9)]"
                  style={{ top: -5, animation: "travel-dot 1.5s linear infinite" }}
                />
              </div>
              <ChevronRight className="h-6 w-6 shrink-0 text-primary" />
            </motion.div>

            {/* ── RIGHT: Claude Agent ── */}
            <motion.div
              className="w-[300px] shrink-0 self-center"
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.7 }}
            >
              <GlassCard glow="secondary" className="px-5 py-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 ring-1 ring-secondary/30">
                    <Bot className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground">Claude AI Agent</p>
                    <p className="font-mono text-[10px] text-muted-foreground">Razonamiento + Tools</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div key={tool.label} className="glass flex flex-col items-center gap-1 rounded-lg px-2 py-2">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        <span className="font-mono text-[8px] text-muted-foreground">{tool.label}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* ═══ MOBILE LAYOUT ═══ */}
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 lg:hidden">
          <motion.div
            className="flex w-full flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Canales</p>
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <GlassCard key={ch.label} className="flex items-center gap-3 px-4 py-3">
                  <Icon className="h-5 w-5 text-foreground" />
                  <span className="font-mono text-sm text-foreground">{ch.label}</span>
                  <span className="ml-auto h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.dotColor }} />
                </GlassCard>
              );
            })}
          </motion.div>
          <ArrowRight className="h-6 w-6 rotate-90 text-primary" />
          <GlassCard glow="primary" className="flex flex-col items-center gap-2 px-8 py-5">
            <Cpu className="h-7 w-7 text-primary" />
            <span className="font-heading text-lg font-bold text-foreground">n8n</span>
          </GlassCard>
          <ArrowRight className="h-6 w-6 rotate-90 text-primary" />
          <GlassCard glow="secondary" className="w-full px-5 py-5">
            <div className="mb-3 flex items-center gap-3">
              <Bot className="h-6 w-6 text-secondary" />
              <p className="font-heading text-sm font-bold text-foreground">Claude AI Agent</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.label} className="glass flex flex-col items-center gap-1 rounded-lg px-2 py-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[9px] text-muted-foreground">{tool.label}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Tech Stack Badges */}
        <motion.div
          className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {techStack.map((label) => (
            <span key={label} className={cn("glass rounded-full px-4 py-1.5", "font-mono text-xs text-muted-foreground")}>
              {label}
            </span>
          ))}
        </motion.div>
      </section>
    </SectionWrapper>
  );
}
