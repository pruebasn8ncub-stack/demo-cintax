import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import DemoChat from "@/components/sections/DemoChat";
import DemoWhatsApp from "@/components/sections/DemoWhatsApp";
import ToolsGrid from "@/components/sections/ToolsGrid";
import N8nFlows from "@/components/sections/N8nFlows";
import Architecture from "@/components/sections/Architecture";
import Metrics from "@/components/sections/Metrics";
import CTAFooter from "@/components/sections/CTAFooter";
import SectionDivider from "@/components/shared/SectionDivider";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <SectionDivider />
      <Problem />
      <SectionDivider />
      <DemoChat />
      <SectionDivider />
      <DemoWhatsApp />
      <SectionDivider />
      <ToolsGrid />
      <SectionDivider />
      <N8nFlows />
      <SectionDivider />
      <Architecture />
      <SectionDivider />
      <Metrics />
      <SectionDivider />
      <CTAFooter />
    </main>
  );
}
