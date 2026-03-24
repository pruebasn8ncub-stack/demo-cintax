import PDFDocument from "pdfkit";

interface ReportSection {
  title: string;
  items: Array<{ label: string; value: string; highlight?: boolean }>;
}

export interface ReportData {
  title: string;
  subtitle: string;
  rut: string;
  period: string;
  generatedAt: string;
  sections: ReportSection[];
  observations?: string[];
  recommendation?: string;
  highlights: Array<{ label: string; value: string }>;
}

function formatCLP(amount: number): string {
  return `$${amount.toLocaleString("es-CL")}`;
}

export function buildTributarioData(period: string, rut: string): ReportData {
  return {
    title: "Informe Tributario",
    subtitle: "Restaurante Don Pedro SpA",
    rut,
    period,
    generatedAt: new Date().toISOString(),
    highlights: [
      { label: "IVA a Pagar", value: formatCLP(3_068_500) },
      { label: "PPM", value: formatCLP(398_500) },
      { label: "Total F29", value: formatCLP(3_712_000) },
    ],
    sections: [
      {
        title: "Resumen de Ventas y Compras",
        items: [
          { label: "Ventas Netas", value: formatCLP(28_450_000) },
          { label: "Compras Netas", value: formatCLP(12_300_000) },
          { label: "Margen Bruto", value: "56.8%" },
        ],
      },
      {
        title: "Desglose IVA",
        items: [
          { label: "IVA Débito Fiscal (19%)", value: formatCLP(5_405_500) },
          { label: "IVA Crédito Fiscal (19%)", value: formatCLP(2_337_000) },
          { label: "IVA a Pagar", value: formatCLP(3_068_500), highlight: true },
        ],
      },
      {
        title: "Otros Impuestos",
        items: [
          { label: "PPM (0.25%)", value: formatCLP(398_500) },
          { label: "Retención Honorarios", value: formatCLP(245_000) },
          { label: "Total a Declarar en F29", value: formatCLP(3_712_000), highlight: true },
        ],
      },
    ],
    observations: [
      "IVA débito fiscal aumentó 12% respecto al mes anterior",
      "Se detectaron 3 facturas pendientes de registro en libro de compras",
      "PPM al día — sin atrasos",
    ],
    recommendation:
      "Revisar facturas pendientes antes del cierre mensual para optimizar crédito fiscal.",
  };
}

export function buildFinancieroData(period: string, rut: string): ReportData {
  return {
    title: "Informe Financiero",
    subtitle: "Restaurante Don Pedro SpA",
    rut,
    period,
    generatedAt: new Date().toISOString(),
    highlights: [
      { label: "Ingresos", value: formatCLP(28_450_000) },
      { label: "Utilidad Op.", value: formatCLP(10_170_000) },
      { label: "Margen", value: "35.7%" },
    ],
    sections: [
      {
        title: "Estado de Resultados",
        items: [
          { label: "Ingresos Totales", value: formatCLP(28_450_000) },
          { label: "Costo de Ventas", value: formatCLP(11_380_000) },
          { label: "Margen Bruto", value: formatCLP(17_070_000), highlight: true },
        ],
      },
      {
        title: "Gastos Operacionales",
        items: [
          { label: "Gastos Administrativos", value: formatCLP(4_800_000) },
          { label: "Gastos de Ventas", value: formatCLP(2_100_000) },
          { label: "Utilidad Operacional", value: formatCLP(10_170_000), highlight: true },
          { label: "Margen Operacional", value: "35.7%" },
        ],
      },
      {
        title: "Indicadores Clave",
        items: [
          { label: "Ticket Promedio", value: formatCLP(18_500) },
          { label: "Clientes Atendidos", value: "1,538" },
          { label: "Costo por Cliente", value: formatCLP(7_400) },
        ],
      },
    ],
    observations: [
      "Margen bruto estable en 60%",
      "Gastos administrativos subieron 5% por nuevo personal",
      "Utilidad operacional positiva y creciente",
    ],
    recommendation:
      "Evaluar optimización de costos de ventas para mejorar margen.",
  };
}

export function buildLaboralData(period: string, rut: string): ReportData {
  return {
    title: "Informe Laboral",
    subtitle: "Restaurante Don Pedro SpA",
    rut,
    period,
    generatedAt: new Date().toISOString(),
    highlights: [
      { label: "Trabajadores", value: "12" },
      { label: "Rem. Bruta", value: formatCLP(7_200_000) },
      { label: "Costo Total", value: formatCLP(8_922_960) },
    ],
    sections: [
      {
        title: "Dotación de Personal",
        items: [
          { label: "Total Trabajadores", value: "12" },
          { label: "Contratos Indefinidos", value: "10" },
          { label: "Contratos Plazo Fijo", value: "2" },
        ],
      },
      {
        title: "Remuneraciones",
        items: [
          { label: "Remuneración Bruta Total", value: formatCLP(7_200_000) },
          { label: "Cotizaciones Previsionales", value: formatCLP(1_440_000) },
          { label: "Seguro de Cesantía", value: formatCLP(216_000) },
          { label: "Mutual de Seguridad", value: formatCLP(66_960) },
          { label: "Costo Total Empresa", value: formatCLP(8_922_960), highlight: true },
        ],
      },
    ],
    observations: [
      "Todas las cotizaciones al día en Previred",
      "2 contratos a plazo fijo próximos a vencer (Abril 2026)",
      "Sin licencias médicas activas",
    ],
    recommendation:
      "Gestionar renovación o indefinición de contratos a plazo fijo antes del 15 de abril.",
  };
}

// ---- PDF Rendering ----

const COLORS = {
  bg: "#0F172A",
  bgLight: "#1E293B",
  gold: "#F59E0B",
  goldDark: "#D97706",
  purple: "#8B5CF6",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  textDark: "#334155",
  rowEven: "#F8FAFC",
  rowOdd: "#EFF3F8",
  white: "#FFFFFF",
};

function drawHeader(doc: PDFKit.PDFDocument, data: ReportData) {
  // Full-width dark header
  doc.rect(0, 0, doc.page.width, 100).fill(COLORS.bg);

  // Gold accent strip
  doc.rect(0, 100, doc.page.width, 4).fill(COLORS.gold);

  // Company name
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COLORS.gold)
    .text("CINTAX CONSULTORES Y ABOGADOS", 50, 18, { characterSpacing: 3 });

  // Report title
  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor(COLORS.text)
    .text(data.title.toUpperCase(), 50, 36, { width: 350 });

  // Subtitle
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(COLORS.textMuted)
    .text(data.subtitle, 50, 68, { width: 350 });

  // Right side info box
  doc.roundedRect(420, 16, 150, 72, 6).fill(COLORS.bgLight);
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.textMuted)
    .text("RUT", 432, 24)
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(COLORS.text)
    .text(data.rut, 432, 34);
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.textMuted)
    .text("PERÍODO", 432, 50)
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(COLORS.gold)
    .text(data.period, 432, 60);
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(COLORS.textMuted)
    .text(
      new Date(data.generatedAt).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      432,
      76
    );
}

function drawHighlights(doc: PDFKit.PDFDocument, data: ReportData, startY: number): number {
  let y = startY;
  const cardWidth = (doc.page.width - 100 - 24) / 3; // 3 cards with gaps

  for (let i = 0; i < Math.min(data.highlights.length, 3); i++) {
    const h = data.highlights[i];
    const x = 50 + i * (cardWidth + 12);

    // Card background
    doc.roundedRect(x, y, cardWidth, 56, 6).fill(COLORS.bgLight);

    // Gold top accent
    doc.rect(x, y, cardWidth, 3).fill(i === 1 ? COLORS.purple : COLORS.gold);

    // Label
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(COLORS.textMuted)
      .text(h.label.toUpperCase(), x + 12, y + 14, { width: cardWidth - 24, characterSpacing: 1 });

    // Value
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(COLORS.text)
      .text(h.value, x + 12, y + 30, { width: cardWidth - 24 });
  }

  return y + 72;
}

function drawSections(doc: PDFKit.PDFDocument, data: ReportData, startY: number): number {
  let y = startY;

  for (const section of data.sections) {
    // Check page break
    if (y > doc.page.height - 180) {
      doc.addPage();
      y = 50;
    }

    // Section header
    doc.roundedRect(50, y, doc.page.width - 100, 26, 4).fill(COLORS.bg);
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.gold)
      .text(section.title.toUpperCase(), 62, y + 8, { width: 400, characterSpacing: 1 });
    y += 34;

    // Items
    for (let i = 0; i < section.items.length; i++) {
      const item = section.items[i];
      const rowBg = i % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd;

      doc.rect(50, y, doc.page.width - 100, 24).fill(rowBg);

      if (item.highlight) {
        // Left gold accent for highlighted rows
        doc.rect(50, y, 3, 24).fill(COLORS.gold);
      }

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(COLORS.textDark)
        .text(item.label, 62, y + 7, { width: 300 });

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(item.highlight ? COLORS.goldDark : COLORS.bg)
        .text(item.value, 370, y + 7, { width: 150, align: "right" });

      y += 24;
    }

    y += 16;
  }

  return y;
}

function drawObservations(doc: PDFKit.PDFDocument, data: ReportData, startY: number): number {
  if (!data.observations || data.observations.length === 0) return startY;

  let y = startY;

  if (y > doc.page.height - 160) {
    doc.addPage();
    y = 50;
  }

  // Header
  doc.roundedRect(50, y, doc.page.width - 100, 26, 4).fill(COLORS.bg);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COLORS.gold)
    .text("OBSERVACIONES", 62, y + 8, { characterSpacing: 1 });
  y += 36;

  for (const obs of data.observations) {
    // Bullet circle
    doc.circle(62, y + 5, 3).fill(COLORS.purple);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.textDark)
      .text(obs, 74, y, { width: 440 });
    y += 20;
  }

  return y + 8;
}

function drawRecommendation(doc: PDFKit.PDFDocument, data: ReportData, startY: number): number {
  if (!data.recommendation) return startY;

  let y = startY;

  if (y > doc.page.height - 120) {
    doc.addPage();
    y = 50;
  }

  // Recommendation box
  doc.roundedRect(50, y, doc.page.width - 100, 60, 6).fill("#FFFBEB");
  doc.rect(50, y, 4, 60).fill(COLORS.gold);

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(COLORS.goldDark)
    .text("RECOMENDACIÓN", 66, y + 10, { characterSpacing: 1 });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.textDark)
    .text(data.recommendation, 66, y + 28, { width: doc.page.width - 140 });

  return y + 72;
}

function drawSignature(doc: PDFKit.PDFDocument, startY: number): number {
  let y = startY;

  if (y > doc.page.height - 130) {
    doc.addPage();
    y = 50;
  }

  // Divider
  doc.rect(50, y, doc.page.width - 100, 1).fill("#E2E8F0");
  y += 20;

  // Signature block
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLORS.bg)
    .text("Esteban Ramos M.", 50, y);
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COLORS.goldDark)
    .text("Director Ejecutivo — Cintax Consultores", 50, y + 16);
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COLORS.textMuted)
    .text("eramos@cintax.cl · +56 9 8156 6898", 50, y + 30);

  return y + 50;
}

function drawFooter(doc: PDFKit.PDFDocument) {
  const footerY = doc.page.height - 36;
  doc.rect(0, footerY - 8, doc.page.width, 44).fill(COLORS.bg);

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(COLORS.textMuted)
    .text(
      "Cintax Consultores y Abogados Ltda. · Providencia 1234, Santiago · +56 9 8156 6898",
      50,
      footerY,
      { width: doc.page.width - 100, align: "center" }
    );

  doc
    .fontSize(6)
    .fillColor("#475569")
    .text(
      "Documento generado automáticamente por Asistente IA Cintax. Confidencial — Solo para uso del cliente.",
      50,
      footerY + 12,
      { width: doc.page.width - 100, align: "center" }
    );
}

export async function generateReportPDF(
  reportType: "tributario" | "financiero" | "laboral",
  period: string,
  rut: string
): Promise<Buffer> {
  const dataBuilders = {
    tributario: buildTributarioData,
    financiero: buildFinancieroData,
    laboral: buildLaboralData,
  };

  const data = dataBuilders[reportType](period, rut);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc, data);
    let y = 120;
    y = drawHighlights(doc, data, y);
    y = drawSections(doc, data, y);
    y = drawObservations(doc, data, y);
    y = drawRecommendation(doc, data, y);
    drawSignature(doc, y);
    drawFooter(doc);

    doc.end();
  });
}
