"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";

/* ── Types ── */

interface Channel {
  icon: LucideIcon;
  label: string;
  dotColor: string;
}

interface ToolItem {
  icon: LucideIcon;
  label: string;
}

/* ── Data ── */

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

/* ── Animation Variants ── */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const leftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 18 } },
};

const centerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 16 } },
};

const rightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 18 } },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 18 } },
};

/* ── Animated Connection Arrow ── */

function AnimatedArrow({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn("flex items-center", className)}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{ transformOrigin: "left" }}
    >
      <div className="relative h-[2px] w-full bg-gradient-to-r from-primary/60 to-primary">
        {/* Animated dot traveling along the line */}
        <div
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_rgba(245,158,11,0.6)]"
          style={{
            animation: "arch-travel-horizontal 2s linear infinite",
            animationDelay: `${delay}s`,
          }}
        />
      </div>
      {/* Arrow tip */}
      <div className="h-0 w-0 shrink-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-primary" />
    </motion.div>
  );
}

/* ── Main Component ── */

export default function Architecture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8">
      <style>{`
        @keyframes arch-travel-horizontal {
          0% { left: 0%; }
          100% { left: calc(100% - 8px); }
        }
      `}</style>

      <section id="architecture" ref={sectionRef}>
        {/* Title */}
        <h2 className="mb-14 text-center font-heading text-[28px] font-bold text-foreground sm:text-[36px]">
          Arquitectura del{" "}
          <span className="text-primary">Sistema</span>
        </h2>

        {/* Desktop: 5-column grid with arrows between */}
        <motion.div
          className="mx-auto hidden max-w-6xl items-center gap-0 lg:grid"
          style={{ gridTemplateColumns: "1fr auto 1fr auto 1fr" }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Column 1: Channels */}
          <motion.div className="flex flex-col gap-3" variants={leftVariants}>
            <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Canales
            </p>
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <GlassCard key={ch.label} className="flex items-center gap-3 px-4 py-3" hover>
                  <Icon className="h-5 w-5 text-foreground" />
                  <span className="font-mono text-sm text-foreground">{ch.label}</span>
                  <span
                    className="ml-auto h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: ch.dotColor }}
                  />
                </GlassCard>
              );
            })}
          </motion.div>

          {/* Arrow: Channels → n8n */}
          <motion.div
            className="flex flex-col items-center justify-center px-4"
            variants={centerVariants}
          >
            <AnimatedArrow className="w-20" delay={0.6} />
          </motion.div>

          {/* Column 2: n8n Orchestrator */}
          <motion.div className="flex items-center justify-center" variants={centerVariants}>
            <GlassCard
              glow="primary"
              className="flex w-full max-w-[200px] flex-col items-center gap-3 px-6 py-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">n8n</span>
              <span className="font-mono text-[11px] text-muted-foreground">Orquestador</span>
              <div
                className="mt-1 h-1 w-12 rounded-full"
                style={{ background: "linear-gradient(90deg, #F59E0B, #8B5CF6)" }}
              />
            </GlassCard>
          </motion.div>

          {/* Arrow: n8n → Agent */}
          <motion.div
            className="flex flex-col items-center justify-center px-4"
            variants={centerVariants}
          >
            <AnimatedArrow className="w-20" delay={0.9} />
          </motion.div>

          {/* Column 3: Claude AI Agent + Tools */}
          <motion.div variants={rightVariants}>
            <GlassCard glow="secondary" className="px-5 py-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 ring-1 ring-secondary/30">
                  <Bot className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">Claude AI Agent</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Razonamiento + Tools</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.label}
                      className="glass flex flex-col items-center gap-1 rounded-lg px-2 py-2"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-mono text-[9px] text-muted-foreground">{tool.label}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Mobile: Vertical stack with down arrows */}
        <motion.div
          className="mx-auto flex max-w-sm flex-col items-center gap-4 lg:hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Channels */}
          <motion.div className="flex w-full flex-col gap-3" variants={leftVariants}>
            <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Canales
            </p>
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <GlassCard key={ch.label} className="flex items-center gap-3 px-4 py-3">
                  <Icon className="h-5 w-5 text-foreground" />
                  <span className="font-mono text-sm text-foreground">{ch.label}</span>
                  <span
                    className="ml-auto h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: ch.dotColor }}
                  />
                </GlassCard>
              );
            })}
          </motion.div>

          {/* Down arrow */}
          <div className="flex flex-col items-center">
            <div className="h-8 w-[2px] bg-gradient-to-b from-primary/40 to-primary" />
            <div className="h-0 w-0 border-x-[5px] border-t-[8px] border-x-transparent border-t-primary" />
          </div>

          {/* n8n */}
          <motion.div variants={centerVariants}>
            <GlassCard glow="primary" className="flex flex-col items-center gap-2 px-8 py-6">
              <Cpu className="h-8 w-8 text-primary" />
              <span className="font-heading text-lg font-bold text-foreground">n8n</span>
              <span className="font-mono text-[10px] text-muted-foreground">Orquestador</span>
            </GlassCard>
          </motion.div>

          {/* Down arrow */}
          <div className="flex flex-col items-center">
            <div className="h-8 w-[2px] bg-gradient-to-b from-primary/40 to-primary" />
            <div className="h-0 w-0 border-x-[5px] border-t-[8px] border-x-transparent border-t-primary" />
          </div>

          {/* Agent */}
          <motion.div className="w-full" variants={rightVariants}>
            <GlassCard glow="secondary" className="px-5 py-5">
              <div className="mb-3 flex items-center gap-3">
                <Bot className="h-6 w-6 text-secondary" />
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">Claude AI Agent</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Razonamiento + Tools</p>
                </div>
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
          </motion.div>
        </motion.div>

        {/* Tech Stack Badges */}
        <motion.div
          className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 1 } } }}
        >
          {techStack.map((label) => (
            <motion.span
              key={label}
              variants={badgeVariants}
              className={cn(
                "glass rounded-full px-4 py-1.5",
                "font-mono text-xs text-muted-foreground"
              )}
            >
              {label}
            </motion.span>
          ))}
        </motion.div>
      </section>
    </SectionWrapper>
  );
}
