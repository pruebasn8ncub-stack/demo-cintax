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
    name: "generateReport",
    description:
      "Genera un reporte financiero del restaurante basado en los datos contables. Puede generar reportes de ingresos, gastos, utilidad y tendencias para un período específico.",
    input_schema: {
      type: "object" as const,
      properties: {
        reportType: {
          type: "string",
          enum: ["mensual", "trimestral", "semestral", "anual"],
          description: "Tipo de reporte según el período que abarca",
        },
        period: {
          type: "string",
          description:
            "Período del reporte en formato 'YYYY-MM' para mensual o 'YYYY' para anual (ej: '2026-03', '2025')",
        },
        includeProjections: {
          type: "boolean",
          description:
            "Si se deben incluir proyecciones financieras basadas en tendencias históricas",
        },
      },
      required: ["reportType", "period"],
    },
  },
  {
    name: "scheduleConsultation",
    description:
      "Agenda una consulta con María González, la contadora del restaurante. Verifica disponibilidad y reserva un horario dentro del horario laboral (Lun-Vie 9:00-18:00).",
    input_schema: {
      type: "object" as const,
      properties: {
        date: {
          type: "string",
          description: "Fecha deseada para la consulta en formato YYYY-MM-DD",
        },
        time: {
          type: "string",
          description: "Hora deseada en formato HH:MM (ej: '10:00', '15:30')",
        },
        subject: {
          type: "string",
          description:
            "Tema o motivo de la consulta (ej: 'Revisión F29 marzo', 'Consulta devolución IVA')",
        },
        duration: {
          type: "number",
          description: "Duración en minutos (30, 60 o 90). Por defecto: 60",
        },
      },
      required: ["date", "time", "subject"],
    },
  },
  {
    name: "sendEmail",
    description:
      "Envía un correo electrónico en nombre del restaurante. Útil para comunicarse con la contadora, proveedores, el SII u otras entidades.",
    input_schema: {
      type: "object" as const,
      properties: {
        to: {
          type: "string",
          description: "Dirección de correo del destinatario",
        },
        subject: {
          type: "string",
          description: "Asunto del correo",
        },
        body: {
          type: "string",
          description: "Contenido del correo en texto plano",
        },
        priority: {
          type: "string",
          enum: ["alta", "normal", "baja"],
          description: "Prioridad del correo. Por defecto: normal",
        },
      },
      required: ["to", "subject", "body"],
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
];

// Zod schemas for server-side validation of tool inputs
export const toolInputSchemas = {
  searchRegulations: z.object({
    query: z.string().min(1),
    category: z
      .enum(["iva", "renta", "laboral", "ppm", "general"])
      .optional(),
  }),

  generateReport: z.object({
    reportType: z.enum(["mensual", "trimestral", "semestral", "anual"]),
    period: z.string().min(4),
    includeProjections: z.boolean().optional(),
  }),

  scheduleConsultation: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    subject: z.string().min(1),
    duration: z.number().optional(),
  }),

  sendEmail: z.object({
    to: z.string().email({ message: "Email inválido" }),
    subject: z.string().min(1),
    body: z.string().min(1),
    priority: z.enum(["alta", "normal", "baja"]).optional(),
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
} as const;

export type ToolName = keyof typeof toolInputSchemas;
