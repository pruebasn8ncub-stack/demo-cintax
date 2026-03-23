"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ToolIndicatorProps {
  toolName: string;
  isActive: boolean;
}

const TOOL_LABELS: Record<string, string> = {
  searchRegulations: "Buscando normativa...",
  generateReport: "Generando reporte...",
  scheduleConsultation: "Agendando consulta...",
  sendEmail: "Enviando correo...",
  checkProcedureStatus: "Consultando estado...",
  calculateTax: "Calculando impuestos...",
};

export default function ToolIndicator({
  toolName,
  isActive,
}: ToolIndicatorProps) {
  const label = TOOL_LABELS[toolName] ?? toolName;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="flex justify-center py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-1.5"
            animate={{
              boxShadow: [
                "0 0 4px rgba(245, 158, 11, 0.15)",
                "0 0 12px rgba(245, 158, 11, 0.35)",
                "0 0 4px rgba(245, 158, 11, 0.15)",
              ],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <Loader2 size={14} className="animate-spin text-[#F59E0B]" />
            <span className="text-xs font-medium text-[#F59E0B]">
              {label}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
