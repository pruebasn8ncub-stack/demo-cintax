"use client";

import Image from "next/image";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { ShinyButton } from "@/components/ui/shiny-button";

export default function CTAFooter() {
  return (
    <>
      {/* CTA Section */}
      <SectionWrapper className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8" delay={0.1}>
        {/* Background layer: AI-generated image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/cta-bg.png" alt="" fill className="object-cover opacity-15" />
        </div>

        <div
          className="mx-auto max-w-4xl rounded-2xl px-6 py-16 text-center sm:px-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(139, 92, 246, 0.05))",
          }}
        >
          <h2 className="mb-4 font-heading text-[32px] font-bold leading-tight text-foreground">
            ¿Listo para crear tu agente IA?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-muted-foreground">
            Conversemos sobre cómo un agente personalizado puede transformar la
            operación de tu empresa.
          </p>

          <ShinyButton>Agendar Demo</ShinyButton>
        </div>
      </SectionWrapper>

      {/* Footer */}
      <footer
        className="border-t px-4 py-8 sm:px-6 lg:px-8"
        style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">&gt;</span> Built with Next.js +
            Claude + n8n + TypeScript
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            &copy; 2026
          </p>
        </div>
      </footer>
    </>
  );
}
