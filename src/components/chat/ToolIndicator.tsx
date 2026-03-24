"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, Calculator, ClipboardList, FileText, Loader2 } from "lucide-react";

interface ToolIndicatorProps {
  toolName: string;
  isActive: boolean;
}

const TOOL_CONFIG: Record<string, { label: string; icon: typeof Search }> = {
  searchRegulations: { label: "Buscando normativa tributaria", icon: Search },
  checkProcedureStatus: { label: "Consultando estado de trámites", icon: ClipboardList },
  calculateTax: { label: "Calculando impuestos", icon: Calculator },
  generateAndSendReport: { label: "Generando informe PDF", icon: FileText },
};

export default function ToolIndicator({ toolName, isActive }: ToolIndicatorProps) {
  const config = TOOL_CONFIG[toolName] ?? { label: toolName, icon: Loader2 };
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="flex justify-center py-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
        >
          <motion.div
            className="inline-flex items-center gap-2.5 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-4 py-2 backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 0 4px rgba(245,158,11,0.1)",
                "0 0 16px rgba(245,158,11,0.25)",
                "0 0 4px rgba(245,158,11,0.1)",
              ],
            }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            >
              <Icon className="h-3.5 w-3.5 text-[#F59E0B]" />
            </motion.div>
            <span className="text-xs font-medium text-[#F59E0B]">{config.label}</span>
            <div className="flex items-center gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 w-1 rounded-full bg-[#F59E0B]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
