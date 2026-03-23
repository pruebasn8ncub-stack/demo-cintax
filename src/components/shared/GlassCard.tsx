"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "primary" | "secondary" | "success" | "destructive";
  hover?: boolean;
}

const glowColors: Record<NonNullable<GlassCardProps["glow"]>, string> = {
  primary: "rgba(245, 158, 11, 0.4)",
  secondary: "rgba(139, 92, 246, 0.4)",
  success: "rgba(34, 197, 94, 0.4)",
  destructive: "rgba(239, 68, 68, 0.4)",
};

const borderColors: Record<NonNullable<GlassCardProps["glow"]>, string> = {
  primary: "rgba(245, 158, 11, 0.5)",
  secondary: "rgba(139, 92, 246, 0.5)",
  success: "rgba(34, 197, 94, 0.5)",
  destructive: "rgba(239, 68, 68, 0.5)",
};

export default function GlassCard({
  children,
  className,
  glow,
  hover = false,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn("glass", className)}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow: glow
                ? `0 0 20px ${glowColors[glow]}`
                : undefined,
              borderColor: glow
                ? borderColors[glow]
                : undefined,
            }
          : undefined
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
