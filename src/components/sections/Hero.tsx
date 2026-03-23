"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import TypeWriter from "@/components/shared/TypeWriter";
import ParticleField from "@/components/shared/ParticleField";
import { cn } from "@/lib/utils";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { ShinyButton } from "@/components/ui/shiny-button";

const RemotionPlayer = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false }
);

const HeroSequenceLazy = dynamic(
  () =>
    import("@/remotion/HeroSequence").then((mod) => ({
      default: mod.HeroSequence,
    })),
  { ssr: false }
);

const BOOT_DURATION_MS = 4000;

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Hero() {
  const [showContent, setShowContent] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    setPlayerReady(true);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, BOOT_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleProbarAgente = useCallback(() => {
    scrollToSection("demo-chat");
  }, []);

  const handleVerArquitectura = useCallback(() => {
    scrollToSection("architecture");
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background-deep"
    >
      {/* Background layer: AI-generated image */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero-bg.png" alt="" fill className="object-cover opacity-20" priority />
      </div>

      {/* Background layer: Particles (hidden on mobile for performance) */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <ParticleField
          count={50}
          colors={["#F59E0B", "#8B5CF6"]}
          speed={0.5}
        />
      </div>

      {/* Background layer: Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)",
          opacity: 0.03,
        }}
      />

      {/* Remotion Boot Sequence Player */}
      {!showContent && playerReady && (
        <div className="absolute inset-0 z-20">
          <RemotionPlayer
            component={HeroSequenceLazy}
            durationInFrames={120}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            autoPlay
            controls={false}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )}

      {/* Hero Content (revealed after boot) */}
      {showContent && (
        <motion.div
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          {/* Badge */}
          <motion.div
            variants={fadeUpVariants}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
            className="mb-6"
          >
            <AnimatedBadge text="AI-POWERED AUTOMATION" color="#F59E0B" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariants}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="mb-6 font-heading text-[28px] font-bold leading-tight tracking-tight text-foreground sm:text-[48px]"
          >
            Agentes IA que
            <br />
            <span
              className="text-primary"
              style={{
                textShadow:
                  "0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)",
              }}
            >
              trabajan por tu empresa.
            </span>{" "}
            24/7.
          </motion.h1>

          {/* TypeWriter subtitle */}
          <motion.div
            variants={fadeUpVariants}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="mb-10 h-8 text-base text-muted-foreground sm:text-lg"
          >
            <span className="font-mono text-primary/70">&gt; </span>
            <TypeWriter
              phrases={[
                "Consultas tributarias en tiempo real",
                "Reportes financieros autom\u00e1ticos",
                "WhatsApp, Web Chat y Email integrados",
              ]}
              typingSpeed={40}
              deletingSpeed={25}
              pauseDuration={2500}
              className="text-muted-foreground"
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
          >
            <ShinyButton onClick={handleProbarAgente}>
              Probar Agente
            </ShinyButton>
            <button
              onClick={handleVerArquitectura}
              className={cn(
                "w-full rounded-lg border border-border bg-transparent px-8 py-3 font-semibold text-foreground",
                "transition-all duration-200 hover:border-primary hover:text-primary",
                "sm:w-auto"
              )}
            >
              Ver Arquitectura
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeUpVariants}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="opacity-50"
            >
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
