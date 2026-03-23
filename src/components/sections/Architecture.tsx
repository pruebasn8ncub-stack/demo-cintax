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

/* ── SVG Connection Paths (3 branches merging into 1, then 1 to agent) ── */

function ConnectionsSVG({ isInView }: { isInView: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 1000 400"
      fill="none"
    >
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 3 branches from channels converging to n8n center */}
      {/* WhatsApp (top) → center */}
      <motion.path
        d="M 200 100 C 280 100, 320 200, 420 200"
        stroke="url(#gold-grad)"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      />
      {/* Web Chat (middle) → center */}
      <motion.path
        d="M 200 200 L 420 200"
        stroke="url(#gold-grad)"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
      />
      {/* Email (bottom) → center */}
      <motion.path
        d="M 200 300 C 280 300, 320 200, 420 200"
        stroke="url(#gold-grad)"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.7, ease: "easeInOut" }}
      />

      {/* Single line from n8n → Agent */}
      <motion.path
        d="M 580 200 L 800 200"
        stroke="url(#gold-grad)"
        strokeWidth="2.5"
        strokeDasharray="6 4"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.0, ease: "easeInOut" }}
      />

      {/* Animated traveling dots */}
      {isInView && (
        <>
          {/* Dot on WhatsApp branch */}
          <circle r="4" fill="#F59E0B" filter="url(#glow)">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path="M 200 100 C 280 100, 320 200, 420 200"
            />
          </circle>
          {/* Dot on Web Chat branch */}
          <circle r="4" fill="#F59E0B" filter="url(#glow)">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M 200 200 L 420 200"
              begin="0.3s"
            />
          </circle>
          {/* Dot on Email branch */}
          <circle r="4" fill="#8B5CF6" filter="url(#glow)">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path="M 200 300 C 280 300, 320 200, 420 200"
              begin="0.6s"
            />
          </circle>
          {/* Dot on n8n → Agent line */}
          <circle r="5" fill="#F59E0B" filter="url(#glow)">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M 580 200 L 800 200"
              begin="1s"
            />
          </circle>
        </>
      )}

      {/* Glow filter for dots */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Merge point glow circle at convergence */}
      {isInView && (
        <motion.circle
          cx="420"
          cy="200"
          r="6"
          fill="#F59E0B"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          filter="url(#glow)"
        />
      )}
    </svg>
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

        {/* Desktop Layout */}
        <div className="relative mx-auto hidden max-w-5xl lg:block" style={{ minHeight: 400 }}>
          {/* SVG Connections Layer */}
          <ConnectionsSVG isInView={isInView} />

          {/* Grid of cards on top of SVG */}
          <div
            className="relative z-10 grid items-center gap-0"
            style={{ gridTemplateColumns: "200px 1fr 180px 1fr 280px", minHeight: 400 }}
          >
            {/* Column 1: Channels */}
            <motion.div
              className="flex flex-col gap-4"
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
                  <GlassCard key={ch.label} className="flex items-center gap-3 px-3 py-2.5" hover>
                    <Icon className="h-4 w-4 text-foreground" />
                    <span className="font-mono text-xs text-foreground">{ch.label}</span>
                    <span
                      className="ml-auto h-2 w-2 rounded-full"
                      style={{ backgroundColor: ch.dotColor }}
                    />
                  </GlassCard>
                );
              })}
            </motion.div>

            {/* Spacer for left connections */}
            <div />

            {/* Column 2: n8n Orchestrator */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.4 }}
            >
              <GlassCard
                glow="primary"
                className="flex w-full flex-col items-center gap-3 px-5 py-7"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
                  <Cpu className="h-8 w-8 text-primary" />
                </div>
                <span className="font-heading text-xl font-bold text-foreground">n8n</span>
                <span className="font-mono text-[11px] text-muted-foreground">Orquestador</span>
                <div
                  className="mt-1 h-1 w-10 rounded-full"
                  style={{ background: "linear-gradient(90deg, #F59E0B, #8B5CF6)" }}
                />
              </GlassCard>
            </motion.div>

            {/* Spacer for right connection */}
            <div />

            {/* Column 3: Claude AI Agent */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.6 }}
            >
              <GlassCard glow="secondary" className="px-4 py-4">
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
                      <div
                        key={tool.label}
                        className="glass flex flex-col items-center gap-1 rounded-lg px-1.5 py-2"
                      >
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

        {/* Mobile: Vertical stack */}
        <motion.div
          className="mx-auto flex max-w-sm flex-col items-center gap-3 lg:hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Channels */}
          <div className="flex w-full flex-col gap-2">
            <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Canales
            </p>
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
          </div>

          {/* Converging arrows visual */}
          <div className="flex items-center justify-center py-2">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M10 10 L30 40" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
              <path d="M30 10 L30 40" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
              <path d="M50 10 L30 40" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="30" cy="44" r="4" fill="#F59E0B" />
              <path d="M25 50 L30 58 L35 50" fill="#F59E0B" />
            </svg>
          </div>

          {/* n8n */}
          <GlassCard glow="primary" className="flex flex-col items-center gap-2 px-8 py-5">
            <Cpu className="h-7 w-7 text-primary" />
            <span className="font-heading text-lg font-bold text-foreground">n8n</span>
            <span className="font-mono text-[10px] text-muted-foreground">Orquestador</span>
          </GlassCard>

          {/* Down arrow */}
          <div className="flex flex-col items-center">
            <div className="h-6 w-[2px] bg-gradient-to-b from-primary/40 to-primary" />
            <div className="h-0 w-0 border-x-[5px] border-t-[8px] border-x-transparent border-t-primary" />
          </div>

          {/* Agent */}
          <GlassCard glow="secondary" className="w-full px-5 py-5">
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

        {/* Tech Stack Badges */}
        <motion.div
          className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {techStack.map((label) => (
            <span
              key={label}
              className={cn(
                "glass rounded-full px-4 py-1.5",
                "font-mono text-xs text-muted-foreground"
              )}
            >
              {label}
            </span>
          ))}
        </motion.div>
      </section>
    </SectionWrapper>
  );
}
