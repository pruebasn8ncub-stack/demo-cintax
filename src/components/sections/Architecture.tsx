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
  MoveRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";

/* ── Data ── */

const channels: { icon: LucideIcon; label: string; dotColor: string }[] = [
  { icon: MessageCircle, label: "WhatsApp", dotColor: "#22C55E" },
  { icon: Globe, label: "Web Chat", dotColor: "#F59E0B" },
  { icon: Mail, label: "Email", dotColor: "#8B5CF6" },
];

const tools: { icon: LucideIcon; label: string }[] = [
  { icon: Search, label: "Normativa SII" },
  { icon: Calculator, label: "Cálculos" },
  { icon: FileText, label: "Reportes" },
  { icon: Calendar, label: "Agenda" },
  { icon: Database, label: "Datos" },
  { icon: Send, label: "Email" },
];

const techStack = ["Next.js", "Claude", "n8n", "Evolution API", "TypeScript", "Tailwind"];

/* ── Main Component ── */

export default function Architecture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8">
      <style>{`
        @keyframes flow-right {
          0% { left: -10px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: calc(100% - 2px); opacity: 0; }
        }
        .flow-line {
          position: relative;
          height: 2px;
          background: repeating-linear-gradient(90deg, var(--line-color, #F59E0B) 0 6px, transparent 6px 12px);
          background-size: 12px 2px;
          animation: dash-move 0.8s linear infinite;
        }
        @keyframes dash-move {
          0% { background-position: 0 0; }
          100% { background-position: 12px 0; }
        }
        .flow-line::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--line-color, #F59E0B);
          box-shadow: 0 0 10px var(--line-color, #F59E0B);
          top: -3px;
          animation: flow-right 2s linear infinite;
        }
      `}</style>

      <section id="architecture" ref={sectionRef}>
        <h2 className="mb-14 text-center font-heading text-[28px] font-bold text-foreground sm:text-[36px]">
          Arquitectura del <span className="text-primary">Sistema</span>
        </h2>

        {/* ═══ DESKTOP — 3 rows showing merge pattern ═══ */}
        <div className="mx-auto hidden max-w-5xl lg:block">
          {/*
            Grid layout:
            Col 1 (Channels)  |  Col 2 (Lines)  |  Col 3 (n8n)  |  Col 4 (Line)  |  Col 5 (Agent)

            Row 1: WhatsApp → diagonal line ↘
            Row 2: Web Chat → straight line → n8n → straight line → Agent
            Row 3: Email → diagonal line ↗
          */}
          <div
            className="grid items-center gap-y-3"
            style={{
              gridTemplateColumns: "220px 100px 180px 1fr 300px",
              gridTemplateRows: "auto auto auto",
            }}
          >
            {/* ── Row 1: WhatsApp + top diagonal ── */}
            <motion.div
              style={{ gridColumn: 1, gridRow: 1 }}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 18 }}
            >
              <GlassCard className="flex items-center gap-3 px-4 py-3" hover>
                <MessageCircle className="h-5 w-5 text-foreground" />
                <span className="font-mono text-sm text-foreground">WhatsApp</span>
                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
              </GlassCard>
            </motion.div>

            {/* Top diagonal: SVG line curving down-right */}
            <motion.div
              style={{ gridColumn: 2, gridRow: "1 / 3" }}
              className="flex items-end justify-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <svg viewBox="0 0 100 80" className="h-20 w-full" fill="none" preserveAspectRatio="none">
                <path d="M 0 15 Q 50 15, 95 65" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite" />
                </path>
                <circle r="4" fill="#22C55E" filter="url(#glow-g)">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 0 15 Q 50 15, 95 65" />
                </circle>
                <defs>
                  <filter id="glow-g"><feGaussianBlur stdDeviation="2" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
              </svg>
            </motion.div>

            {/* ── Row 2: Web Chat + straight line + n8n + straight line + Agent ── */}
            <motion.div
              style={{ gridColumn: 1, gridRow: 2 }}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 18 }}
            >
              <GlassCard className="flex items-center gap-3 px-4 py-3" hover>
                <Globe className="h-5 w-5 text-foreground" />
                <span className="font-mono text-sm text-foreground">Web Chat</span>
                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
              </GlassCard>
            </motion.div>

            {/* Middle straight line: Web Chat → n8n */}
            <motion.div
              style={{ gridColumn: 2, gridRow: 2, zIndex: 10 }}
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              <svg viewBox="0 0 100 20" className="h-5 w-full" fill="none" preserveAspectRatio="none">
                <path d="M 0 10 L 100 10" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite" />
                </path>
                <circle r="4" fill="#F59E0B">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 10 L 100 10" begin="0.2s" />
                </circle>
              </svg>
            </motion.div>

            {/* n8n card spans row 1-3 in col 3 */}
            <motion.div
              style={{ gridColumn: 3, gridRow: "1 / 4" }}
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 16 }}
            >
              <GlassCard glow="primary" className="flex w-full flex-col items-center gap-3 px-5 py-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
                  <Cpu className="h-8 w-8 text-primary" />
                </div>
                <span className="font-heading text-xl font-bold text-foreground">n8n</span>
                <span className="font-mono text-[10px] text-muted-foreground">Orquestador</span>
                <div className="h-1 w-10 rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B, #8B5CF6)" }} />
              </GlassCard>
            </motion.div>

            {/* Straight line: n8n → Agent (col 4, spans all rows centered) */}
            <motion.div
              style={{ gridColumn: 4, gridRow: "1 / 4" }}
              className="flex items-center px-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className="flow-line flex-1" style={{ "--line-color": "#F59E0B" } as React.CSSProperties} />
              <MoveRight className="ml-1 h-5 w-5 shrink-0 text-primary" />
            </motion.div>

            {/* Agent card spans row 1-3 in col 5 */}
            <motion.div
              style={{ gridColumn: 5, gridRow: "1 / 4" }}
              className="flex items-center"
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7, type: "spring", stiffness: 80, damping: 18 }}
            >
              <GlassCard glow="secondary" className="w-full px-5 py-5">
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

            {/* ── Row 3: Email + bottom diagonal ── */}
            <motion.div
              style={{ gridColumn: 1, gridRow: 3 }}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 18 }}
            >
              <GlassCard className="flex items-center gap-3 px-4 py-3" hover>
                <Mail className="h-5 w-5 text-foreground" />
                <span className="font-mono text-sm text-foreground">Email</span>
                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
              </GlassCard>
            </motion.div>

            {/* Bottom diagonal: SVG line curving up-right */}
            <motion.div
              style={{ gridColumn: 2, gridRow: "2 / 4" }}
              className="flex items-start justify-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <svg viewBox="0 0 100 80" className="h-20 w-full" fill="none" preserveAspectRatio="none">
                <path d="M 0 65 Q 50 65, 95 15" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite" />
                </path>
                <circle r="4" fill="#8B5CF6" filter="url(#glow-p)">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 0 65 Q 50 65, 95 15" />
                </circle>
                <defs>
                  <filter id="glow-p"><feGaussianBlur stdDeviation="2" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
              </svg>
            </motion.div>
          </div>

          {/* "CANALES" label */}
          <div className="mt-2" style={{ marginLeft: 60 }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Canales</p>
          </div>
        </div>

        {/* ═══ MOBILE ═══ */}
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

        {/* Tech Stack */}
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
