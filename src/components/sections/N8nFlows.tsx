"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Webhook,
  Code,
  FileText,
  Send,
  ShieldCheck,
  Mail,
  Calendar,
  MessageCircle,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";

/* ── Types ── */

interface FlowNode {
  icon: LucideIcon;
  label: string;
}

interface Workflow {
  id: string;
  tab: string;
  nodes: FlowNode[];
}

/* ── Data ── */

const workflows: Workflow[] = [
  {
    id: "report",
    tab: "Generar Reporte",
    nodes: [
      { icon: Webhook, label: "Webhook" },
      { icon: Code, label: "Procesar" },
      { icon: FileText, label: "Formato" },
      { icon: Send, label: "Response" },
    ],
  },
  {
    id: "email",
    tab: "Enviar Email",
    nodes: [
      { icon: Webhook, label: "Webhook" },
      { icon: ShieldCheck, label: "Validar" },
      { icon: Mail, label: "Resend" },
      { icon: Send, label: "Response" },
    ],
  },
  {
    id: "schedule",
    tab: "Agendar",
    nodes: [
      { icon: Webhook, label: "Webhook" },
      { icon: Calendar, label: "Calendario" },
      { icon: Mail, label: "Email" },
      { icon: Send, label: "Response" },
    ],
  },
  {
    id: "whatsapp",
    tab: "WhatsApp",
    nodes: [
      { icon: MessageCircle, label: "WhatsApp" },
      { icon: Globe, label: "HTTP" },
      { icon: Code, label: "Parser" },
      { icon: MessageCircle, label: "WhatsApp" },
    ],
  },
];

/* ── Animation Variants ── */

const flowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 16 },
  },
};

/* ── CSS for dash animation + traveling dot ── */

const dashKeyframes = `
@keyframes dash-flow {
  to { stroke-dashoffset: -24; }
}
@keyframes travel-dot {
  0% { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}
`;

/* ── Node Card ── */

function NodeCard({ node }: { node: FlowNode }) {
  const Icon = node.icon;
  return (
    <motion.div variants={nodeVariants}>
      <GlassCard className="flex w-[100px] flex-col items-center gap-2 px-3 py-4 sm:w-[120px]">
        <Icon className="h-6 w-6 text-primary" />
        <span className="text-center font-mono text-[11px] text-muted-foreground">
          {node.label}
        </span>
      </GlassCard>
    </motion.div>
  );
}

/* ── SVG Connection Line ── */

function ConnectionLine({ index }: { index: number }) {
  const lineId = `flow-line-${index}`;
  return (
    <div className="relative flex w-8 shrink-0 items-center sm:w-12">
      <svg
        className="h-8 w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 48 8"
      >
        <path
          id={lineId}
          d="M0 4 L48 4"
          fill="none"
          stroke="#F59E0B"
          strokeWidth={2}
          strokeDasharray="8 4"
          style={{ animation: "dash-flow 1s linear infinite" }}
        />
        <circle
          r={3}
          fill="#F59E0B"
          style={{
            offsetPath: `path('M0 4 L48 4')`,
            animation: "travel-dot 1.5s linear infinite",
          }}
        />
      </svg>
    </div>
  );
}

/* ── Flow Diagram ── */

function FlowDiagram({ workflow }: { workflow: Workflow }) {
  return (
    <motion.div
      key={workflow.id}
      className="flex flex-wrap items-center justify-center gap-y-4"
      variants={flowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {workflow.nodes.map((node, i) => (
        <div key={`${workflow.id}-${i}`} className="flex items-center">
          <NodeCard node={node} />
          {i < workflow.nodes.length - 1 && <ConnectionLine index={i} />}
        </div>
      ))}
    </motion.div>
  );
}

/* ── Main Component ── */

export default function N8nFlows() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8">
      <style>{dashKeyframes}</style>

      <section id="n8n-flows">
        {/* Title */}
        <h2 className="mb-10 text-center font-heading text-[28px] font-bold text-foreground sm:text-[36px]">
          Orquestaci&oacute;n inteligente con{" "}
          <span className="text-primary">n8n</span>
        </h2>

        {/* Tab Bar */}
        <div className="mx-auto mb-10 flex max-w-2xl flex-wrap justify-center gap-2">
          {workflows.map((wf, i) => (
            <button
              key={wf.id}
              onClick={() => setActiveTab(i)}
              className={cn(
                "relative rounded-full px-4 py-2 font-mono text-xs font-medium transition-colors",
                i === activeTab
                  ? "text-background"
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {i === activeTab && (
                <motion.span
                  layoutId="n8n-tab-indicator"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <span className="relative z-10">{wf.tab}</span>
            </button>
          ))}
        </div>

        {/* Flow Diagram */}
        <div className="mx-auto flex min-h-[160px] max-w-3xl items-center justify-center">
          <AnimatePresence mode="wait">
            <FlowDiagram workflow={workflows[activeTab]} />
          </AnimatePresence>
        </div>
      </section>
    </SectionWrapper>
  );
}
