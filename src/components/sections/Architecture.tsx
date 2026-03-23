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

interface Tool {
  icon: LucideIcon;
  label: string;
}

interface TechBadge {
  label: string;
}

/* ── Data ── */

const channels: Channel[] = [
  { icon: MessageCircle, label: "WhatsApp", dotColor: "#22C55E" },
  { icon: Globe, label: "Web Chat", dotColor: "#F59E0B" },
  { icon: Mail, label: "Email", dotColor: "#8B5CF6" },
];

const tools: Tool[] = [
  { icon: Search, label: "Buscar SII" },
  { icon: Calculator, label: "Calcular" },
  { icon: FileText, label: "Reportes" },
  { icon: Calendar, label: "Agendar" },
  { icon: Database, label: "Supabase" },
  { icon: Send, label: "Resend" },
];

const techStack: TechBadge[] = [
  { label: "Next.js" },
  { label: "Claude" },
  { label: "n8n" },
  { label: "Evolution API" },
  { label: "TypeScript" },
  { label: "Tailwind" },
];

/* ── Animation Variants ── */

const leftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 18, staggerChildren: 0.1 },
  },
};

const centerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 16, delay: 0.2 },
  },
};

const rightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 18, delay: 0.3, staggerChildren: 0.08 },
  },
};

const childFadeIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const svgVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, delay: 0.6, ease: "easeInOut" },
  },
};

const badgeContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.8 } },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 18 } },
};

/* ── CSS for SVG animations ── */

const archStyles = `
@keyframes arch-dash {
  to { stroke-dashoffset: -24; }
}
@keyframes arch-travel {
  0% { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}
`;

/* ── Channel Card ── */

function ChannelCard({ channel }: { channel: Channel }) {
  const Icon = channel.icon;
  return (
    <motion.div variants={childFadeIn}>
      <GlassCard className="flex items-center gap-3 px-4 py-3" hover>
        <Icon className="h-5 w-5 text-foreground" />
        <span className="font-mono text-sm text-foreground">{channel.label}</span>
        <span
          className="ml-auto h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: channel.dotColor }}
        />
      </GlassCard>
    </motion.div>
  );
}

/* ── Tool Badge ── */

function ToolBadge({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <motion.div variants={childFadeIn}>
      <GlassCard className="flex flex-col items-center gap-1.5 px-2 py-2.5">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-mono text-[10px] text-muted-foreground">{tool.label}</span>
      </GlassCard>
    </motion.div>
  );
}

/* ── SVG Connection Lines (between columns) ── */

function ConnectionSVG() {
  /* Paths from left column to center, and center to right */
  const leftPaths = [
    "M0 30 C60 30, 40 80, 100 80",
    "M0 80 C60 80, 40 80, 100 80",
    "M0 130 C60 130, 40 80, 100 80",
  ];

  const rightPaths = [
    "M0 80 C60 80, 40 40, 100 40",
    "M0 80 C60 80, 40 120, 100 120",
  ];

  return (
    <>
      {/* Left-to-center lines */}
      <svg
        className="pointer-events-none absolute left-[calc(33.33%-8px)] top-1/2 hidden h-[160px] w-[100px] -translate-x-full -translate-y-1/2 lg:block"
        style={{ overflow: "visible" }}
      >
        {leftPaths.map((d, i) => (
          <g key={`left-${i}`}>
            <motion.path
              d={d}
              fill="none"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="8 4"
              variants={svgVariants}
              style={{ animation: "arch-dash 1s linear infinite" }}
            />
            <circle
              r={3}
              fill="#F59E0B"
              style={{
                offsetPath: `path('${d}')`,
                animation: "arch-travel 2s linear infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          </g>
        ))}
      </svg>

      {/* Center-to-right lines */}
      <svg
        className="pointer-events-none absolute right-[calc(33.33%-8px)] top-1/2 hidden h-[160px] w-[100px] translate-x-full -translate-y-1/2 lg:block"
        style={{ overflow: "visible" }}
      >
        {rightPaths.map((d, i) => (
          <g key={`right-${i}`}>
            <motion.path
              d={d}
              fill="none"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="8 4"
              variants={svgVariants}
              style={{ animation: "arch-dash 1s linear infinite" }}
            />
            <circle
              r={3}
              fill="#F59E0B"
              style={{
                offsetPath: `path('${d}')`,
                animation: "arch-travel 2s linear infinite",
                animationDelay: `${i * 0.4}s`,
              }}
            />
          </g>
        ))}
      </svg>
    </>
  );
}

/* ── Main Component ── */

export default function Architecture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8">
      <style>{archStyles}</style>

      <section id="architecture" ref={sectionRef}>
        {/* Title */}
        <h2 className="mb-12 text-center font-heading text-[28px] font-bold text-foreground sm:text-[36px]">
          Arquitectura del{" "}
          <span className="text-primary">Sistema</span>
        </h2>

        {/* 3-Column Layout */}
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Left: Channel Cards */}
          <motion.div
            className="flex flex-col gap-4"
            variants={leftVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <p className="mb-2 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Canales
            </p>
            {channels.map((ch) => (
              <ChannelCard key={ch.label} channel={ch} />
            ))}
          </motion.div>

          {/* Center: n8n Orchestrator */}
          <motion.div
            className="flex items-center justify-center"
            variants={centerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <GlassCard
              glow="primary"
              className="flex w-full max-w-[220px] flex-col items-center gap-3 px-6 py-8"
            >
              <Cpu className="h-10 w-10 text-primary" />
              <span className="font-heading text-xl font-bold text-foreground">n8n</span>
              <span className="font-mono text-xs text-muted-foreground">Orquestador</span>
              <div
                className="mt-2 h-1 w-16 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #F59E0B, #8B5CF6)",
                }}
              />
            </GlassCard>
          </motion.div>

          {/* Right: Claude AI Agent + Tools */}
          <motion.div
            className="flex flex-col gap-4"
            variants={rightVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <GlassCard glow="secondary" className="px-5 py-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/20">
                  <Cpu className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">Claude AI Agent</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Razonamiento + Tools</p>
                </div>
              </div>

              {/* 2x3 Tool Grid */}
              <div className="grid grid-cols-3 gap-2">
                {tools.map((tool) => (
                  <ToolBadge key={tool.label} tool={tool} />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* SVG Connection Lines (desktop only) */}
          <ConnectionSVG />
        </div>

        {/* Tech Stack Badges */}
        <motion.div
          className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3"
          variants={badgeContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {techStack.map((tech) => (
            <motion.span
              key={tech.label}
              variants={badgeVariants}
              className={cn(
                "glass rounded-full px-4 py-1.5",
                "font-mono text-xs text-muted-foreground"
              )}
            >
              {tech.label}
            </motion.span>
          ))}
        </motion.div>
      </section>
    </SectionWrapper>
  );
}
