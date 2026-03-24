"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import TypeWriter from "@/components/shared/TypeWriter";
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

const HeroBackgroundLazy = dynamic(
  () =>
    import("@/remotion/HeroBackground").then((mod) => ({
      default: mod.HeroBackground,
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
  const [bootPhase, setBootPhase] = useState<"playing" | "fading" | "done">("playing");
  const [playerReady, setPlayerReady] = useState(false);

  const showContent = bootPhase === "done";

  // Lock scroll during boot sequence
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    setPlayerReady(true);

    const bootTimer = setTimeout(() => {
      setBootPhase("fading");
    }, BOOT_DURATION_MS);

    const doneTimer = setTimeout(() => {
      setBootPhase("done");
      document.body.style.overflow = "";
    }, BOOT_DURATION_MS + 600);

    return () => {
      clearTimeout(bootTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
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
      {/* Background layer: Remotion animated data flow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {playerReady && (
          <RemotionPlayer
            component={HeroBackgroundLazy}
            durationInFrames={900}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            loop
            autoPlay
            controls={false}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </div>

      {/* Vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(11,17,32,0.7) 100%)",
        }}
      />

      {/* Remotion Boot Sequence — fixed fullscreen overlay */}
      {bootPhase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50"
          style={{ background: "#0B1120" }}
          animate={{
            opacity: bootPhase === "fading" ? 0 : 1,
            scale: bootPhase === "fading" ? 1.05 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {playerReady && (
            <RemotionPlayer
              component={HeroSequenceLazy}
              durationInFrames={120}
              fps={30}
              compositionWidth={1920}
              compositionHeight={1080}
              autoPlay
              controls={false}
              style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          )}
        </motion.div>
      )}

      {/* Hero Content (always rendered, animated on boot complete) */}
      <motion.div
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
        initial="hidden"
        animate={showContent ? "visible" : "hidden"}
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
    </section>
  );
}
