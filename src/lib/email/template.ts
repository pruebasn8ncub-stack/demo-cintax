interface EmailTemplateData {
  reportTitle: string;
  reportType: string;
  period: string;
  clientName: string;
  clientRut: string;
  highlights: Array<{ label: string; value: string }>;
  downloadUrl: string;
  consultantName: string;
  consultantRole: string;
  consultantEmail: string;
  consultantPhone: string;
}

export function buildReportEmailHTML(data: EmailTemplateData): string {
  const highlightRows = data.highlights
    .map(
      (h) => `
        <tr>
          <td style="padding:10px 16px;font-size:14px;color:#64748B;border-bottom:1px solid #1E293B">${h.label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#F8FAFC;font-weight:600;text-align:right;border-bottom:1px solid #1E293B">${h.value}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.reportTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:#0B1120;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B1120">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#F59E0B;font-weight:700;margin-bottom:8px">Cintax Consultores</div>
                    <div style="font-size:26px;font-weight:700;color:#F8FAFC;line-height:1.2;margin-bottom:4px">${data.reportTitle}</div>
                    <div style="font-size:14px;color:#94A3B8;margin-top:8px">${data.period}</div>
                  </td>
                  <td width="80" valign="top" align="right">
                    <div style="width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,#F59E0B,#D97706);display:flex;align-items:center;justify-content:center">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr><td style="width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,#F59E0B,#D97706);text-align:center;vertical-align:middle;font-size:28px;font-weight:800;color:#0F172A">C</td></tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- GOLD ACCENT LINE -->
          <tr><td style="height:3px;background:linear-gradient(90deg,#F59E0B,#8B5CF6,#F59E0B)"></td></tr>

          <!-- CLIENT INFO -->
          <tr>
            <td style="background-color:#0F172A;padding:24px 40px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px 16px;background-color:#1E293B;border-radius:8px">
                    <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#F59E0B;font-weight:600;margin-bottom:6px">Cliente</div>
                    <div style="font-size:16px;color:#F8FAFC;font-weight:600">${data.clientName}</div>
                    <div style="font-size:13px;color:#94A3B8;margin-top:2px">RUT: ${data.clientRut}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="background-color:#0F172A;padding:0 40px 16px">
              <p style="font-size:15px;color:#CBD5E1;line-height:1.6;margin:0">
                Estimado/a cliente,<br><br>
                Adjunto encontrará el <strong style="color:#F8FAFC">${data.reportTitle}</strong> correspondiente al período <strong style="color:#F59E0B">${data.period}</strong>. A continuación, un resumen de los datos más relevantes:
              </p>
            </td>
          </tr>

          <!-- HIGHLIGHTS TABLE -->
          <tr>
            <td style="background-color:#0F172A;padding:0 40px 24px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1E293B;border-radius:12px;overflow:hidden">
                <tr>
                  <td colspan="2" style="padding:14px 16px;background-color:#162033">
                    <div style="font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#F59E0B;font-weight:700">Resumen Ejecutivo</div>
                  </td>
                </tr>
                ${highlightRows}
              </table>
            </td>
          </tr>

          <!-- DOWNLOAD BUTTON -->
          <tr>
            <td style="background-color:#0F172A;padding:0 40px 32px" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:10px;padding:14px 32px">
                    <a href="${data.downloadUrl}" style="color:#0F172A;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.5px;display:inline-block">
                      ⬇ Descargar Informe PDF
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size:12px;color:#64748B;margin-top:12px">El enlace de descarga expira en 30 minutos</p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr><td style="height:1px;background-color:#1E293B"></td></tr>

          <!-- SIGNATURE -->
          <tr>
            <td style="background-color:#0F172A;padding:32px 40px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="56" valign="top">
                    <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#8B5CF6,#6D28D9);text-align:center;line-height:48px;font-size:20px;font-weight:700;color:#F8FAFC">
                      ${data.consultantName.charAt(0)}
                    </div>
                  </td>
                  <td style="padding-left:12px" valign="top">
                    <div style="font-size:15px;font-weight:700;color:#F8FAFC">${data.consultantName}</div>
                    <div style="font-size:13px;color:#F59E0B;margin-top:2px">${data.consultantRole}</div>
                    <div style="font-size:13px;color:#94A3B8;margin-top:4px">
                      ${data.consultantEmail}<br>
                      ${data.consultantPhone}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);border-radius:0 0 16px 16px;padding:24px 40px;text-align:center">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#F59E0B;font-weight:600;margin-bottom:8px">Cintax Consultores y Abogados Ltda.</div>
              <div style="font-size:12px;color:#64748B;line-height:1.6">
                Providencia 1234, Santiago de Chile<br>
                +56 9 8156 6898 · contacto@cintax.cl
              </div>
              <div style="margin-top:16px;padding-top:16px;border-top:1px solid #1E293B">
                <span style="font-size:11px;color:#475569">Este correo fue generado automáticamente por el Asistente IA de Cintax.</span>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
