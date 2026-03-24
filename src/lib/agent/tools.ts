import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { z } from "zod";

export const agentTools: Tool[] = [
  {
    name: "searchRegulations",
    description:
      "Busca normativas y regulaciones tributarias chilenas del SII, Código Tributario y legislación laboral. Útil para consultas sobre IVA, PPM, renta, cotizaciones y obligaciones legales.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Términos de búsqueda para encontrar la normativa relevante (ej: 'crédito fiscal IVA', 'cotizaciones AFP')",
        },
        category: {
          type: "string",
          enum: ["iva", "renta", "laboral", "ppm", "general"],
          description:
            "Categoría opcional para filtrar resultados: iva, renta, laboral, ppm o general",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "checkProcedureStatus",
    description:
      "Consulta el estado de trámites activos ante el SII, Dirección del Trabajo u otras entidades. Muestra progreso, última actualización y próximos pasos.",
    input_schema: {
      type: "object" as const,
      properties: {
        procedureId: {
          type: "string",
          description:
            "ID del trámite (ej: 'PROC-001'). Si no se proporciona, muestra todos los trámites activos.",
        },
        type: {
          type: "string",
          enum: ["sii", "dt", "municipalidad", "todos"],
          description:
            "Tipo de entidad para filtrar trámites. Por defecto: todos",
        },
      },
      required: [],
    },
  },
  {
    name: "calculateTax",
    description:
      "Calcula impuestos del restaurante: IVA (débito - crédito fiscal), PPM (0,25% de ingresos brutos), o estimación anual de renta. Muestra fórmulas y desglose detallado.",
    input_schema: {
      type: "object" as const,
      properties: {
        taxType: {
          type: "string",
          enum: ["iva", "ppm", "renta_anual"],
          description: "Tipo de impuesto a calcular",
        },
        period: {
          type: "string",
          description:
            "Período para el cálculo en formato 'YYYY-MM' para mensual o 'YYYY' para anual",
        },
        revenue: {
          type: "number",
          description:
            "Ingresos del período en CLP (opcional, usa datos internos si no se proporciona)",
        },
        expenses: {
          type: "number",
          description:
            "Gastos del período en CLP (opcional, usa datos internos si no se proporciona)",
        },
      },
      required: ["taxType", "period"],
    },
  },
  {
    name: "generateAndSendReport",
    description:
      "Genera un informe profesional en PDF (tributario, financiero o laboral) del Restaurante Don Pedro SpA y lo envía por el canal especificado (email, whatsapp o ambos). IMPORTANTE: Si el canal incluye WhatsApp, necesitas el número del usuario. Si incluye email, necesitas su dirección de correo. Pide los datos que falten antes de usar esta herramienta.",
    input_schema: {
      type: "object" as const,
      properties: {
        reportType: {
          type: "string",
          enum: ["tributario", "financiero", "laboral"],
          description: "Tipo de informe a generar",
        },
        period: {
          type: "string",
          description: "Período del informe (ej: 'Marzo 2026')",
        },
        channel: {
          type: "string",
          enum: ["email", "whatsapp", "both"],
          description: "Canal de envío: email, whatsapp o both (ambos)",
        },
        email: {
          type: "string",
          description: "Dirección de correo del destinatario (requerido si channel es email o both)",
        },
        phone: {
          type: "string",
          description: "Número de WhatsApp del destinatario sin '+' (requerido si channel es whatsapp o both)",
        },
      },
      required: ["reportType", "period", "channel"],
    },
  },
];

// Zod schemas for server-side validation of tool inputs
export const toolInputSchemas = {
  searchRegulations: z.object({
    query: z.string().min(1),
    category: z
      .enum(["iva", "renta", "laboral", "ppm", "general"])
      .optional(),
  }),

  checkProcedureStatus: z.object({
    procedureId: z.string().optional(),
    type: z.enum(["sii", "dt", "municipalidad", "todos"]).optional(),
  }),

  calculateTax: z.object({
    taxType: z.enum(["iva", "ppm", "renta_anual"]),
    period: z.string().min(4),
    revenue: z.number().optional(),
    expenses: z.number().optional(),
  }),

  generateAndSendReport: z.object({
    reportType: z.enum(["tributario", "financiero", "laboral"]),
    period: z.string().min(1),
    channel: z.enum(["email", "whatsapp", "both"]),
    email: z.string().optional(),
    phone: z.string().optional(),
  }),
} as const;

export type ToolName = keyof typeof toolInputSchemas;
