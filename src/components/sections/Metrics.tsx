"use client";

import { Clock, Shield, MessageSquare, Wrench } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { cn } from "@/lib/utils";

interface Metric {
  value: number | string;
  prefix?: string;
  suffix?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METRICS: Metric[] = [
  {
    value: 3,
    prefix: "< ",
    suffix: "s",
    label: "Tiempo de respuesta",
    icon: Clock,
  },
  {
    value: "24/7",
    label: "Disponibilidad",
    icon: Shield,
  },
  {
    value: 3,
    label: "Canales integrados",
    icon: MessageSquare,
  },
  {
    value: 4,
    label: "Herramientas IA",
    icon: Wrench,
  },
];

export default function Metrics() {
  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8" delay={0.1}>
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <GlassCard
              key={metric.label}
              className={cn(
                "flex flex-col items-center justify-center p-6 text-center"
              )}
            >
              <metric.icon className="mb-4 h-8 w-8 text-primary" />
              <AnimatedCounter
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                className="font-heading text-5xl font-bold text-primary"
              />
              <span className="mt-2 font-sans text-sm text-muted-foreground">
                {metric.label}
              </span>
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
