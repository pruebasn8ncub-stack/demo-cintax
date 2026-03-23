"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

type AnimatedBadgeProps = {
  text?: string
  color?: string
  href?: string
}

function hexToRgba(hexColor: string, alpha: number): string {
  const hex = hexColor.replace("#", "")
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return hexColor
}

export function AnimatedBadge({
  text = "AI-POWERED AUTOMATION",
  color = "#F59E0B",
  href,
}: AnimatedBadgeProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex max-w-fit items-center justify-center gap-3 rounded-full border border-[#334155] bg-[#1E293B]/80 backdrop-blur-sm px-4 py-1.5 text-[#94A3B8] transition-colors hover:border-[#F59E0B]/50"
    >
      <div
        className="relative flex h-1.5 w-1.5 items-center justify-center rounded-full"
        style={{ backgroundColor: hexToRgba(color, 0.4) }}
      >
        <div
          className="flex h-2.5 w-2.5 animate-ping items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute top-1/2 left-1/2 flex h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ backgroundColor: hexToRgba(color, 0.8) }}
        />
      </div>
      <div className="mx-1 h-4 w-px bg-[#334155]" />
      <span className="bg-clip-text text-xs font-medium tracking-widest uppercase" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
        {text}
      </span>
      <ChevronRight className="ml-1 h-3 w-3 text-[#94A3B8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#F59E0B]" />
    </motion.div>
  )

  return href ? (
    <Link href={href} className="inline-block">{content}</Link>
  ) : (
    content
  )
}
