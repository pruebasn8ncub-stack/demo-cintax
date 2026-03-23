import { callN8nWebhook } from "@/lib/n8n/client";
import {
  financialData,
  calendarAvailability,
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

async function handleGenerateReport(
  input: Record<string, unknown>
): Promise<string> {
  const parsed = toolInputSchemas.generateReport.parse(input);

  const n8nResult = await callN8nWebhook("generate-report", {
    businessRut: businessProfile.rut,
    reportType: parsed.reportType,
    period: parsed.period,
    includeProjections: parsed.includeProjections ?? false,
  });

  if (!n8nResult.error) {
    return `Reporte generado exitosamente:\n${JSON.stringify(n8nResult, null, 2)}`;
  }

  // Fallback: build report from mock data
  const months = financialData.months;

  let filteredMonths = months;
  if (parsed.reportType === "mensual") {
    const [year, month] = parsed.period.split("-").map(Number);
    filteredMonths = months.filter((m) => {
      const monthIndex = months.indexOf(m);
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      return m.year === year && monthNames.indexOf(m.month) === month - 1;
    });
  } else if (parsed.reportType === "trimestral") {
    filteredMonths = months.slice(-3);
  }

  if (filteredMonths.length === 0) {
    return `No hay datos financieros disponibles para el período ${parsed.period} (${parsed.reportType}).`;
  }

  const totalRevenue = filteredMonths.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = filteredMonths.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgRevenue = Math.round(totalRevenue / filteredMonths.length);
  const avgExpenses = Math.round(totalExpenses / filteredMonths.length);
  const margin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;

  let report = `📊 **Reporte ${parsed.reportType} — ${parsed.period}**\n`;
  report += `Empresa: ${businessProfile.name} (${businessProfile.rut})\n\n`;
  report += `**Resumen del período (${filteredMonths.length} mes${filteredMonths.length > 1 ? "es" : ""}):**\n`;
  report += `- Ingresos totales: ${formatCLP(totalRevenue)}\n`;
  report += `- Gastos totales: ${formatCLP(totalExpenses)}\n`;
  report += `- Utilidad bruta: ${formatCLP(totalProfit)}\n`;
  report += `- Margen de utilidad: ${formatPercentage(margin)}\n\n`;
  report += `**Promedios mensuales:**\n`;
  report += `- Ingreso promedio: ${formatCLP(avgRevenue)}\n`;
  report += `- Gasto promedio: ${formatCLP(avgExpenses)}\n\n`;

  report += `**Detalle por mes:**\n`;
  for (const m of filteredMonths) {
    const profit = m.revenue - m.expenses;
    report += `- ${m.month} ${m.year}: Ingresos ${formatCLP(m.revenue)} | Gastos ${formatCLP(m.expenses)} | Utilidad ${formatCLP(profit)}\n`;
  }

  if (parsed.includeProjections) {
    const projectedMonthlyRevenue = avgRevenue;
    const projectedMonthlyExpenses = avgExpenses;
    const projectedAnnualProfit =
      (projectedMonthlyRevenue - projectedMonthlyExpenses) * 12;
    report += `\n**Proyecciones (basadas en tendencia actual):**\n`;
    report += `- Ingreso mensual proyectado: ${formatCLP(projectedMonthlyRevenue)}\n`;
    report += `- Gasto mensual proyectado: ${formatCLP(projectedMonthlyExpenses)}\n`;
    report += `- Utilidad anual proyectada: ${formatCLP(projectedAnnualProfit)}\n`;
  }

  return report;
}

async function handleScheduleConsultation(
  input: Record<string, unknown>
): Promise<string> {
  const parsed = toolInputSchemas.scheduleConsultation.parse(input);

  const n8nResult = await callN8nWebhook("schedule-consultation", {
    consultant: calendarAvailability.consultant,
    date: parsed.date,
    time: parsed.time,
    subject: parsed.subject,
    duration: parsed.duration ?? 60,
    businessName: businessProfile.name,
  });

  if (!n8nResult.error) {
    return `Consulta agendada exitosamente:\n${JSON.stringify(n8nResult, null, 2)}`;
  }

  // Fallback: check mock calendar
  const slot = calendarAvailability.slots.find(
    (s) => s.date === parsed.date && s.startTime === parsed.time
  );

  if (!slot) {
    const availableOnDate = calendarAvailability.slots
      .filter((s) => s.date === parsed.date && s.available)
      .map((s) => s.startTime);

    if (availableOnDate.length === 0) {
      return `No hay horarios disponibles para ${parsed.date}. ${calendarAvailability.consultant} atiende de lunes a viernes de 9:00 a 18:00.`;
    }

    return `El horario ${parsed.time} no está disponible el ${parsed.date}. Horarios disponibles ese día: ${availableOnDate.join(", ")}.`;
  }

  if (!slot.available) {
    const availableOnDate = calendarAvailability.slots
      .filter((s) => s.date === parsed.date && s.available)
      .map((s) => s.startTime);

    return `El horario ${parsed.time} del ${parsed.date} ya está ocupado. Horarios disponibles ese día: ${availableOnDate.length > 0 ? availableOnDate.join(", ") : "ninguno"}.`;
  }

  const duration = parsed.duration ?? 60;
  return `Consulta agendada con ${calendarAvailability.consultant}:\n- Fecha: ${parsed.date}\n- Hora: ${parsed.time}\n- Duración: ${duration} minutos\n- Tema: ${parsed.subject}\n- Empresa: ${businessProfile.name}\n\nSe enviará un recordatorio por correo electrónico 24 horas antes.`;
}

async function handleSendEmail(
  input: Record<string, unknown>
): Promise<string> {
  const parsed = toolInputSchemas.sendEmail.parse(input);

  const n8nResult = await callN8nWebhook("send-email", {
    to: parsed.to,
    subject: parsed.subject,
    body: parsed.body,
    priority: parsed.priority ?? "normal",
    from: `${businessProfile.name} <contacto@donpedro.cl>`,
  });

  if (!n8nResult.error) {
    return `Correo enviado exitosamente:\n${JSON.stringify(n8nResult, null, 2)}`;
  }

  // Fallback: mock success
  return `Correo enviado exitosamente (modo demo):\n- Para: ${parsed.to}\n- Asunto: ${parsed.subject}\n- Prioridad: ${parsed.priority ?? "normal"}\n- Estado: Enviado\n- ID de seguimiento: EMAIL-${Date.now()}`;
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

// ---- Main dispatcher ----

export async function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  try {
    const handlers: Record<ToolName, (input: Record<string, unknown>) => string | Promise<string>> = {
      searchRegulations: handleSearchRegulations,
      generateReport: handleGenerateReport,
      scheduleConsultation: handleScheduleConsultation,
      sendEmail: handleSendEmail,
      checkProcedureStatus: handleCheckProcedureStatus,
      calculateTax: handleCalculateTax,
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
