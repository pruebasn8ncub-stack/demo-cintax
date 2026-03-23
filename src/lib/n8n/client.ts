const N8N_TIMEOUT_MS = 5_000;

interface N8nSuccessResponse {
  error?: false;
  [key: string]: unknown;
}

interface N8nErrorResponse {
  error: true;
  message: string;
}

type N8nResponse = N8nSuccessResponse | N8nErrorResponse;

export async function callN8nWebhook(
  workflowPath: string,
  data: Record<string, unknown>
): Promise<N8nResponse> {
  const baseUrl = process.env.N8N_WEBHOOK_BASE_URL;

  if (!baseUrl) {
    return {
      error: true,
      message: "N8N_WEBHOOK_BASE_URL no está configurada en las variables de entorno.",
    };
  }

  const url = `${baseUrl}/${workflowPath}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        error: true,
        message: `Error en webhook n8n: HTTP ${response.status} — ${response.statusText}`,
      };
    }

    const result = (await response.json()) as Record<string, unknown>;
    return result;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        error: true,
        message: `Timeout: el webhook n8n no respondió en ${N8N_TIMEOUT_MS / 1_000}s.`,
      };
    }

    const message =
      err instanceof Error ? err.message : "Error desconocido al llamar webhook n8n.";

    return { error: true, message };
  }
}
