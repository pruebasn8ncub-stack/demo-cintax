"use client"

import React from "react"

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ShinyButton({ children, onClick, className = "" }: ShinyButtonProps) {
  return (
    <>
      <style jsx>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }
        @property --gradient-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }
        .shiny-cta {
          --shiny-cta-bg: #0F172A;
          --shiny-cta-bg-subtle: #1E293B;
          --shiny-cta-fg: #0F172A;
          --shiny-cta-highlight: #F59E0B;
          --shiny-cta-highlight-subtle: #FBBF24;
          isolation: isolate;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          outline-offset: 4px;
          padding: 0.875rem 2rem;
          font-family: var(--font-inter), sans-serif;
          font-size: 1rem;
          line-height: 1.2;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          color: var(--shiny-cta-fg);
          background: #F59E0B;
          box-shadow: 0 0 20px rgba(245,158,11,0.3);
          transition: 300ms cubic-bezier(0.25, 1, 0.5, 1);
          transition-property: box-shadow, transform;
        }
        .shiny-cta:hover {
          box-shadow: 0 0 40px rgba(245,158,11,0.5);
          transform: translateY(-2px);
        }
        .shiny-cta:active {
          transform: translateY(0);
        }
        .shiny-cta::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255,255,255,0.3) 50%,
            transparent 80%
          );
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <button className={`shiny-cta ${className}`} onClick={onClick}>
        <span className="relative z-10">{children}</span>
      </button>
    </>
  )
}
