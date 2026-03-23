"use client";

import { motion, type Variants } from "framer-motion";
import { X, Check } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";

/* ── Data ── */

const painPoints = [
  "WhatsApp y correos sin responder por horas",
  "Declaraciones tributarias con riesgo de atraso",
  "Cálculos manuales propensos a errores",
  "Sin visibilidad del estado de trámites",
];

const benefits = [
  "Respuestas instantáneas 24/7 por WhatsApp y web",
  "Declaraciones y plazos monitoreados automáticamente",
  "Cálculos tributarios exactos al instante",
  "Seguimiento de trámites en tiempo real",
];

/* ── Animation Variants ── */

const columnVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const leftSlide: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

const rightSlide: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

const notificationStackVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const notificationCardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const dashboardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ── Notification Stack (left visual) ── */

interface NotificationCardProps {
  label: string;
  badge: string;
  rotation: number;
  color: string;
}

const notifications: NotificationCardProps[] = [
  { label: "WhatsApp", badge: "5", rotation: -3, color: "#EF4444" },
  { label: "Correos", badge: "12", rotation: 2, color: "#EF4444" },
  { label: "Tareas SII", badge: "3", rotation: -1.5, color: "#EF4444" },
];

function NotificationStack() {
  return (
    <motion.div
      className="relative mx-auto mb-6 flex h-40 w-full max-w-[260px] items-end justify-center"
      variants={notificationStackVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {notifications.map((n, i) => (
        <motion.div
          key={n.label}
          variants={notificationCardVariants}
          className={cn(
            "absolute w-52 rounded-lg border border-border/60 bg-card p-3",
            "shadow-lg"
          )}
          style={{
            rotate: `${n.rotation}deg`,
            bottom: `${i * 18}px`,
            zIndex: i,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{n.label}</span>
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: n.color }}
            >
              {n.badge}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-border/40" />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── Dashboard Mock (right visual) ── */

function DashboardMock() {
  return (
    <motion.div
      className="mx-auto mb-6 w-full max-w-[280px] rounded-lg border border-border/60 bg-card p-4"
      variants={dashboardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {/* Status row */}
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-success" />
        <span className="text-sm font-medium text-foreground">
          Agente activo
        </span>
      </div>

      {/* Stat */}
      <p className="mb-3 font-mono text-xs text-muted-foreground">
        3 consultas respondidas
      </p>

      {/* Progress bar */}
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-border/30">
        <motion.div
          className="h-full rounded-full bg-success"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      {/* Check row */}
      <div className="flex items-center gap-1.5">
        <Check className="h-4 w-4 text-success" />
        <span className="text-xs text-success">
          Todo al día
        </span>
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */

export default function Problem() {
  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8">
      {/* Section heading */}
      <h2 className="mb-12 text-center font-heading text-[28px] font-bold text-foreground sm:text-[36px]">
        El problema que resolvemos
      </h2>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* ── Left card — Sin automatización ── */}
        <motion.div
          variants={leftSlide}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <GlassCard glow="destructive" className="h-full p-6">
            <h3 className="mb-6 font-heading text-xl font-bold text-foreground">
              <span className="text-destructive">Sin</span> automatización
            </h3>

            {/* Notification stack visual */}
            <NotificationStack />

            {/* Pain points */}
            <motion.ul
              className="space-y-3"
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {painPoints.map((point) => (
                <motion.li
                  key={point}
                  variants={itemVariants}
                  className="flex items-start gap-2.5"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-sm leading-snug text-muted-foreground">
                    {point}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </GlassCard>
        </motion.div>

        {/* ── Right card — Con agente IA ── */}
        <motion.div
          variants={rightSlide}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <GlassCard glow="primary" className="h-full p-6">
            <h3 className="mb-6 font-heading text-xl font-bold text-foreground">
              <span className="text-primary">Con</span> agente IA
            </h3>

            {/* Dashboard mock visual */}
            <DashboardMock />

            {/* Benefits */}
            <motion.ul
              className="space-y-3"
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {benefits.map((benefit) => (
                <motion.li
                  key={benefit}
                  variants={itemVariants}
                  className="flex items-start gap-2.5"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-sm leading-snug text-muted-foreground">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </GlassCard>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
