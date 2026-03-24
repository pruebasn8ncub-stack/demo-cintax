import { callN8nWebhook } from "@/lib/n8n/client";
import { generateReportPDF, buildTributarioData, buildFinancieroData, buildLaboralData } from "@/lib/pdf/report-generator";
import { buildReportEmailHTML } from "@/lib/email/template";
import { savePDF } from "@/lib/pdf/store";
import {
  financialData,
  activeProcedures,
  businessProfile,
} from "@/lib/agent/mock-data";
import { toolInputSchemas, type ToolName } from "@/lib/agent/tools";
import regulations from "@/data/regulations.json";

// ---- Types for regulations.json ----
interface Regulation {
  id: string;
  title: string;
  article: string;
  category: string;
  summary: string;
  source: string;
}

const typedRegulations = regulations as Regulation[];

// ---- Formatting helpers ----

function formatCLP(amount: number): string {
  return `$${amount.toLocaleString("es-CL")} CLP`;
}

function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ---- Individual handlers ----

function handleSearchRegulations(input: Record<string, unknown>): string {
  const parsed = toolInputSchemas.searchRegulations.parse(input);
  const queryLower = parsed.query.toLowerCase();

  let results = typedRegulations.filter((reg) => {
    const matchesText =
      reg.title.toLowerCase().includes(queryLower) ||
      reg.summary.toLowerCase().includes(queryLower);
    const matchesCategory = parsed.category
      ? reg.category === parsed.category
      : true;
    return matchesText && matchesCategory;
  });

  if (results.length === 0 && parsed.category) {
    results = typedRegulations.filter(
      (reg) => reg.category === parsed.category
    );
  }

  const top3 = results.slice(0, 3);

  if (top3.length === 0) {
    return `No se encontraron normativas para la consulta "${parsed.query}"${parsed.category ? ` en categoría "${parsed.category}"` : ""}.`;
  }

  const formatted = top3
    .map(
      (reg, i) =>
        `${i + 1}. **${reg.title}** (${reg.article})\n   ${reg.summary}\n   Fuente: ${reg.source}`
    )
    .join("\n\n");

  return `Se encontraron ${results.length} normativa(s). Mostrando las ${top3.length} más relevantes:\n\n${formatted}`;
}

function handleCheckProcedureStatus(input: Record<string, unknown>): string {
  const parsed = toolInputSchemas.checkProcedureStatus.parse(input);

  let results = [...activeProcedures];

  if (parsed.procedureId) {
    results = results.filter((p) => p.id === parsed.procedureId);
  }

  if (parsed.type && parsed.type !== "todos") {
    const typeMapping: Record<string, string[]> = {
      sii: ["Solicitud de devolución IVA exportador", "Actualización de actividad económica en SII"],
      dt: ["Fiscalización preventiva de nómina"],
      municipalidad: [],
    };
    const relevantNames = typeMapping[parsed.type] ?? [];
    if (relevantNames.length > 0) {
      results = results.filter((p) => relevantNames.includes(p.name));
    }
  }

  if (results.length === 0) {
    return parsed.procedureId
      ? `No se encontró el trámite con ID "${parsed.procedureId}".`
      : "No hay trámites activos que coincidan con los filtros especificados.";
  }

  const statusLabels: Record<string, string> = {
    en_tramite: "En trámite",
    completado: "Completado",
    pendiente_respuesta: "Pendiente de respuesta",
  };

  const formatted = results
    .map(
      (p) =>
        `**${p.name}** (${p.id})\n- Estado: ${statusLabels[p.status] ?? p.status}\n- Avance: ${p.progress}%\n- Última actualización: ${p.lastUpdate}\n- Siguiente paso: ${p.nextStep}`
    )
    .join("\n\n");

  return `Estado de trámites activos:\n\n${formatted}`;
}

function handleCalculateTax(input: Record<string, unknown>): string {
  const parsed = toolInputSchemas.calculateTax.parse(input);

  if (parsed.taxType === "iva") {
    const [year, month] = parsed.period.split("-").map(Number);
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];

    const monthData = financialData.months.find(
      (m) => m.year === year && monthNames.indexOf(m.month) === month - 1
    );

    const revenue = parsed.revenue ?? monthData?.revenue ?? 0;
    const expenses = parsed.expenses ?? monthData?.expenses ?? 0;

    const debitoFiscal = Math.round(revenue * 0.19);
    const creditoFiscal = Math.round(expenses * 0.19);
    const ivaAPagar = debitoFiscal - creditoFiscal;

    let result = `**Cálculo IVA — ${parsed.period}**\n\n`;
    result += `**Fórmulas:**\n`;
    result += `- Débito fiscal = Ventas netas × 19%\n`;
    result += `- Crédito fiscal = Compras con IVA × 19%\n`;
    result += `- IVA a pagar = Débito fiscal − Crédito fiscal\n\n`;
    result += `**Desglose:**\n`;
    result += `- Ingresos (ventas netas): ${formatCLP(revenue)}\n`;
    result += `- Débito fiscal (19%): ${formatCLP(debitoFiscal)}\n`;
    result += `- Gastos con IVA: ${formatCLP(expenses)}\n`;
    result += `- Crédito fiscal (19%): ${formatCLP(creditoFiscal)}\n`;
    result += `- **IVA a pagar: ${formatCLP(ivaAPagar)}**\n`;

    if (ivaAPagar < 0) {
      result += `\nNota: El resultado es un crédito a favor de ${formatCLP(Math.abs(ivaAPagar))}, trasladable al período siguiente.`;
    }

    return result;
  }

  if (parsed.taxType === "ppm") {
    const [year, month] = parsed.period.split("-").map(Number);
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];

    const monthData = financialData.months.find(
      (m) => m.year === year && monthNames.indexOf(m.month) === month - 1
    );

    const revenue = parsed.revenue ?? monthData?.revenue ?? 0;
    const ppm = Math.round(revenue * 0.0025);

    let result = `**Cálculo PPM — ${parsed.period}**\n\n`;
    result += `**Fórmula:**\n`;
    result += `- PPM = Ingresos brutos × 0,25%\n\n`;
    result += `**Desglose:**\n`;
    result += `- Ingresos brutos del mes: ${formatCLP(revenue)}\n`;
    result += `- Tasa PPM: 0,25%\n`;
    result += `- **PPM a pagar: ${formatCLP(ppm)}**\n\n`;
    result += `Nota: Este PPM se imputa como crédito contra el impuesto de renta anual en la declaración F22.`;

    return result;
  }

  if (parsed.taxType === "renta_anual") {
    const months = financialData.months;
    const totalRevenue = parsed.revenue ?? months.reduce((s, m) => s + m.revenue, 0);
    const totalExpenses = parsed.expenses ?? months.reduce((s, m) => s + m.expenses, 0);

    const monthsCovered = months.length;
    const projectedAnnualRevenue = Math.round(
      (totalRevenue / monthsCovered) * 12
    );
    const projectedAnnualExpenses = Math.round(
      (totalExpenses / monthsCovered) * 12
    );
    const projectedProfit = projectedAnnualRevenue - projectedAnnualExpenses;
    const taxRate = 0.25;
    const estimatedTax = Math.round(projectedProfit * taxRate);
    const totalPPM = Math.round(projectedAnnualRevenue * 0.0025);
    const netTaxPayable = estimatedTax - totalPPM;

    let result = `**Estimación Impuesto de Renta Anual — ${parsed.period}**\n\n`;
    result += `**Nota:** ${businessProfile.name} está en régimen Pro-PYME transparente (14D N°3), por lo que las utilidades se asignan directamente al dueño para tributar con Impuesto Global Complementario. Esta estimación usa la tasa del 25% como referencia.\n\n`;
    result += `**Fórmula:**\n`;
    result += `- Utilidad proyectada = (Ingresos − Gastos) × 12/${monthsCovered}\n`;
    result += `- Impuesto estimado = Utilidad proyectada × 25%\n`;
    result += `- PPM acumulado = Ingresos anuales × 0,25%\n`;
    result += `- Saldo = Impuesto estimado − PPM acumulado\n\n`;
    result += `**Desglose (proyección anual basada en ${monthsCovered} meses de datos):**\n`;
    result += `- Ingresos anuales proyectados: ${formatCLP(projectedAnnualRevenue)}\n`;
    result += `- Gastos anuales proyectados: ${formatCLP(projectedAnnualExpenses)}\n`;
    result += `- Utilidad bruta proyectada: ${formatCLP(projectedProfit)}\n`;
    result += `- Tasa de referencia: ${formatPercentage(taxRate, 0)}\n`;
    result += `- Impuesto estimado: ${formatCLP(estimatedTax)}\n`;
    result += `- PPM acumulado (crédito): ${formatCLP(totalPPM)}\n`;
    result += `- **Saldo neto: ${formatCLP(netTaxPayable)}**\n`;

    if (netTaxPayable < 0) {
      result += `\nEl resultado indica una devolución estimada de ${formatCLP(Math.abs(netTaxPayable))} por PPM pagados en exceso.`;
    }

    return result;
  }

  return `Tipo de impuesto "${parsed.taxType}" no soportado. Use: iva, ppm o renta_anual.`;
}

async function handleGenerateAndSendReport(
  input: Record<string, unknown>
): Promise<string> {
  const parsed = toolInputSchemas.generateAndSendReport.parse(input);

  const needsEmail = parsed.channel === "email" || parsed.channel === "both";
  const needsWhatsApp = parsed.channel === "whatsapp" || parsed.channel === "both";

  if (needsEmail && !parsed.email) {
    return "Error: Se requiere una dirección de email para enviar el informe por correo.";
  }
  if (needsWhatsApp && !parsed.phone) {
    return "Error: Se requiere un número de WhatsApp para enviar el informe.";
  }

  // Generate PDF
  const pdfBuffer = await generateReportPDF(
    parsed.reportType,
    parsed.period,
    businessProfile.rut
  );
  const pdfBase64 = pdfBuffer.toString("base64");
  const filename = `Informe_${parsed.reportType}_${parsed.period.replace(/\s+/g, "_")}.pdf`;

  const results: string[] = [];
  const reportLabel = {
    tributario: "Tributario",
    financiero: "Financiero",
    laboral: "Laboral",
  }[parsed.reportType];

  // Save PDF for download
  const pdfId = savePDF(pdfBuffer, filename);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const downloadUrl = `${baseUrl}/api/reports/${pdfId}`;
  results.push(`PDF disponible para descarga: ${downloadUrl}`);

  // Send via email
  if (needsEmail) {
    const dataBuilders = {
      tributario: buildTributarioData,
      financiero: buildFinancieroData,
      laboral: buildLaboralData,
    };
    const reportData = dataBuilders[parsed.reportType](parsed.period, businessProfile.rut);

    const emailHTML = buildReportEmailHTML({
      reportTitle: `Informe ${reportLabel}`,
      reportType: parsed.reportType,
      period: parsed.period,
      clientName: businessProfile.name,
      clientRut: businessProfile.rut,
      highlights: reportData.highlights,
      downloadUrl: downloadUrl,
      consultantName: "Esteban Ramos M.",
      consultantRole: "Director Ejecutivo — Cintax Consultores",
      consultantEmail: "eramos@cintax.cl",
      consultantPhone: "+56 9 8156 6898",
    });

    const emailResult = await callN8nWebhook("cintax-send-email", {
      to: parsed.email,
      subject: `Informe ${reportLabel} — ${parsed.period} — ${businessProfile.name}`,
      body: `Informe ${reportLabel} del período ${parsed.period} para ${businessProfile.name}.`,
      html: emailHTML,
      attachment: {
        base64: pdfBase64,
        filename,
        contentType: "application/pdf",
      },
    });

    if (!emailResult.error) {
      results.push(`Email enviado a ${parsed.email} con PDF adjunto`);
    } else {
      results.push(`Error enviando email: ${emailResult.message}`);
    }
  }

  // Send via WhatsApp
  if (needsWhatsApp) {
    const waResult = await callN8nWebhook("send-whatsapp", {
      phone: parsed.phone,
      message: `📊 Informe ${reportLabel} — ${parsed.period}\n${businessProfile.name} (${businessProfile.rut})\n\nGenerado por Asistente Cintax`,
      document: {
        base64: pdfBase64,
        filename,
        mimetype: "application/pdf",
      },
    });

    if (!waResult.error) {
      results.push(`WhatsApp enviado a +${parsed.phone} con PDF adjunto`);
    } else {
      results.push(`Error enviando WhatsApp: ${waResult.message}`);
    }
  }

  return `Informe ${reportLabel} (${parsed.period}) generado en PDF.\n\nResultados de envío:\n${results.map((r) => `- ${r}`).join("\n")}`;
}

// ---- Main dispatcher ----

export async function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  try {
    const handlers: Record<ToolName, (input: Record<string, unknown>) => string | Promise<string>> = {
      searchRegulations: handleSearchRegulations,
      checkProcedureStatus: handleCheckProcedureStatus,
      calculateTax: handleCalculateTax,
      generateAndSendReport: handleGenerateAndSendReport,
    };

    const handler = handlers[toolName as ToolName];

    if (!handler) {
      return `Herramienta "${toolName}" no reconocida. Herramientas disponibles: ${Object.keys(handlers).join(", ")}.`;
    }

    return await handler(toolInput);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error desconocido al ejecutar herramienta.";
    return `Error al ejecutar "${toolName}": ${message}`;
  }
}
