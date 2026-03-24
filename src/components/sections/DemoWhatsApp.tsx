"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";

import { WhatsAppDemo } from "@/remotion/WhatsAppDemo";

const RemotionPlayer = dynamic(
  () => import("@remotion/player").then((mod) => ({ default: mod.Player })),
  { ssr: false }
);

/* ── Feature Pills ── */

const features = [
  { label: "Informes PDF", icon: "📄" },
  { label: "Envío Email", icon: "📧" },
  { label: "WhatsApp", icon: "💬" },
  { label: "Firma corporativa", icon: "✍️" },
];

/* ── Main Component ── */

export default function DemoWhatsApp() {
  return (
    <SectionWrapper className="px-4 py-20 sm:px-6 lg:px-8" delay={0.1}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Left column */}
        <div className="flex flex-col justify-center lg:w-[40%]">
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-widest text-primary">
            CANAL WHATSAPP
          </span>

          <h2 className="mb-4 font-heading text-[32px] font-bold leading-tight text-foreground">
            Informes profesionales
            <br />
            <span className="text-primary">directo a WhatsApp</span>
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
            El agente genera informes tributarios, financieros y laborales en
            PDF con firma corporativa y los envía directamente al WhatsApp
            del cliente. También por email con diseño profesional.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <motion.div
                key={f.label}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full border border-[#1E293B] bg-[#0F172A]/60 px-4 py-2 backdrop-blur-sm"
              >
                <span className="text-sm">{f.icon}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {f.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column — Remotion animation */}
        <div className="flex justify-center lg:w-[60%]">
          <div className="w-full max-w-[400px] overflow-hidden rounded-2xl">
            <RemotionPlayer
              component={WhatsAppDemo as React.ComponentType<Record<string, unknown>>}
              inputProps={{}}
              durationInFrames={380}
              fps={30}
              compositionWidth={400}
              compositionHeight={560}
              loop
              autoPlay
              controls={false}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
