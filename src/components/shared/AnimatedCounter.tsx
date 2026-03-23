"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function NumericCounter({
  value,
  duration = 2,
  prefix,
  suffix,
  className,
}: {
  value: number;
  duration: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const display = useTransform(springValue, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <span ref={ref} className={cn("font-heading text-4xl font-bold text-foreground", className)}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

function StringCounter({
  value,
  prefix,
  suffix,
  className,
}: {
  value: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("font-heading text-4xl font-bold text-foreground", className)}
    >
      {prefix}
      {value}
      {suffix}
    </motion.span>
  );
}

export default function AnimatedCounter({
  value,
  duration = 2,
  prefix,
  suffix,
  className,
}: AnimatedCounterProps) {
  if (typeof value === "number") {
    return (
      <NumericCounter
        value={value}
        duration={duration}
        prefix={prefix}
        suffix={suffix}
        className={className}
      />
    );
  }

  return (
    <StringCounter
      value={value}
      prefix={prefix}
      suffix={suffix}
      className={className}
    />
  );
}
