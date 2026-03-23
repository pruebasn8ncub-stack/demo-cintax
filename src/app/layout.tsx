import type { Metadata } from "next";
import { Space_Mono, Inter, JetBrains_Mono } from "next/font/google";
import { DemoModeProvider } from "@/lib/context/demo-mode";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AI Agent Demo — Automatización Inteligente para PYMEs",
  description:
    "Demostración de agentes de IA para automatización inteligente de procesos en PYMEs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceMono.variable} ${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <DemoModeProvider>
          {children}
          <Toaster />
        </DemoModeProvider>
      </body>
    </html>
  );
}
