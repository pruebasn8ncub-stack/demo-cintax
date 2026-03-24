export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getPDF } from "@/lib/pdf/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pdf = getPDF(id);

  if (!pdf) {
    return NextResponse.json(
      { error: "Reporte no encontrado o expirado." },
      { status: 404 }
    );
  }

  return new NextResponse(new Uint8Array(pdf.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdf.filename}"`,
      "Cache-Control": "private, max-age=1800",
    },
  });
}
