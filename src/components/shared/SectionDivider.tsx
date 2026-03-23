"use client";

import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  glow?: boolean;
}

export default function SectionDivider({
  className,
  glow = false,
}: SectionDividerProps) {
  return (
    <div className={cn("relative w-full py-4", className)}>
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, #F59E0B, #8B5CF6, transparent)",
        }}
      />
      {glow && (
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 blur-sm"
          style={{
            background:
              "linear-gradient(to right, transparent, #F59E0B, #8B5CF6, transparent)",
          }}
        />
      )}
    </div>
  );
}
