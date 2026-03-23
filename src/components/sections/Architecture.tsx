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

/* ── Animated Connector: 3 lines merging into 1 ── */

function MergeConnector({ isInView }: { isInView: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Container for the 3→1 merge lines */}
      <svg
        viewBox="0 0 120 200"
        className="h-[200px] w-[120px]"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Top branch: from top-left to center-right */}
        <motion.path
          d="M 0 30 C 40 30, 80 100, 120 100"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="6 4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        {/* Middle branch: straight across */}
        <motion.path
          d="M 0 100 L 120 100"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        {/* Bottom branch: from bottom-left to center-right */}
        <motion.path
          d="M 0 170 C 40 170, 80 100, 120 100"
          stroke="#8B5CF6"
          strokeWidth="2"
          strokeDasharray="6 4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* Merge point glow */}
        {isInView && (
          <motion.circle
            cx="120"
            cy="100"
            r="5"
            fill="#F59E0B"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
          />
        )}

        {/* Traveling particles */}
        {isInView && (
          <>
            <circle r="3.5" fill="#F59E0B" opacity="0.9">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 0 30 C 40 30, 80 100, 120 100" />
            </circle>
            <circle r="3.5" fill="#F59E0B" opacity="0.9">
              <animateMotion dur="1.8s" repeatCount="indefinite" path="M 0 100 L 120 100" begin="0.3s" />
            </circle>
            <circle r="3.5" fill="#8B5CF6" opacity="0.9">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 0 170 C 40 170, 80 100, 120 100" begin="0.6s" />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}

/* ── Single arrow connector ── */

function SingleConnector({ isInView }: { isInView: boolean }) {
  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 120 40" className="h-[40px] w-[120px]" fill="none">
        <motion.path
          d="M 0 20 L 100 20"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
        />
        {/* Arrow head */}
        <motion.polygon
          points="100,12 120,20 100,28"
          fill="#F59E0B"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.5 }}
        />
        {/* Traveling particle */}
        {isInView && (
          <circle r="4" fill="#F59E0B" opacity="0.9">
            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 20 L 100 20" begin="1s" />
          </circle>
        )}
      </svg>
    </div>
  );
}

/* ── Main Component ── */

export default function Architecture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8">
      <section id="architecture" ref={sectionRef}>
        {/* Title */}
        <h2 className="mb-14 text-center font-heading text-[28px] font-bold text-foreground sm:text-[36px]">
          Arquitectura del{" "}
          <span className="text-primary">Sistema</span>
        </h2>

        {/* Desktop: horizontal flow with merge */}
        <div className="mx-auto hidden max-w-6xl items-center lg:flex lg:gap-0">
          {/* Channels column */}
          <motion.div
            className="flex w-[220px] shrink-0 flex-col gap-3"
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

          {/* Merge connector: 3 → 1 */}
          <MergeConnector isInView={isInView} />

          {/* n8n Orchestrator */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.5 }}
          >
            <GlassCard glow="primary" className="flex w-[180px] flex-col items-center gap-3 px-5 py-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">n8n</span>
              <span className="font-mono text-[11px] text-muted-foreground">Orquestador</span>
              <div className="mt-1 h-1 w-10 rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B, #8B5CF6)" }} />
            </GlassCard>
          </motion.div>

          {/* Single connector: n8n → Agent */}
          <SingleConnector isInView={isInView} />

          {/* Claude AI Agent */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.7 }}
          >
            <GlassCard glow="secondary" className="w-[300px] px-5 py-5">
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

        {/* Mobile: vertical stack */}
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 lg:hidden">
          <motion.div
            className="flex w-full flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
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
          transition={{ duration: 0.6, delay: 1.5 }}
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
