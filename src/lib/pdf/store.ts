const pdfStore = new Map<string, { buffer: Buffer; filename: string; createdAt: number }>();

const TTL_MS = 30 * 60 * 1000; // 30 minutes

function cleanup() {
  const now = Date.now();
  for (const [id, entry] of pdfStore) {
    if (now - entry.createdAt > TTL_MS) {
      pdfStore.delete(id);
    }
  }
}

export function savePDF(buffer: Buffer, filename: string): string {
  cleanup();
  const id = crypto.randomUUID();
  pdfStore.set(id, { buffer, filename, createdAt: Date.now() });
  return id;
}

export function getPDF(id: string): { buffer: Buffer; filename: string } | null {
  cleanup();
  const entry = pdfStore.get(id);
  if (!entry) return null;
  return { buffer: entry.buffer, filename: entry.filename };
}
