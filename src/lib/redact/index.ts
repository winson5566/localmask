/* Round-trip redaction: rewrite the ORIGINAL file (xlsx/docx/pdf) with
 * detected entities masked or redacted, returning a blob in the same format. */
import type { Entity } from '../entities';

export type RedactMode = 'mask' | 'redact';
/** Detect entities for each input segment. Returns one Entity[] per segment. */
export type DetectBatch = (texts: string[]) => Promise<Entity[][]>;

export interface RedactResult {
  blob: Blob;
  filename: string;
  note?: string;
}

function outName(original: string, mode: RedactMode): string {
  const i = original.lastIndexOf('.');
  const base = i < 0 ? original : original.slice(0, i);
  const ext = i < 0 ? '' : original.slice(i);
  return `${base}.${mode}${ext}`;
}

export async function redactFile(
  file: File,
  kind: 'xlsx' | 'docx' | 'pdf',
  mode: RedactMode,
  detect: DetectBatch,
): Promise<RedactResult> {
  const buf = await file.arrayBuffer();
  if (kind === 'xlsx') {
    const { redactXlsx } = await import('./xlsx');
    return { blob: await redactXlsx(buf, mode, detect), filename: outName(file.name, mode) };
  }
  if (kind === 'docx') {
    const { redactDocx } = await import('./docx');
    return {
      blob: await redactDocx(buf, mode, detect),
      filename: outName(file.name, mode),
      note: 'docx-note',
    };
  }
  const { redactPdf } = await import('./pdf');
  return {
    blob: await redactPdf(buf, mode, detect),
    filename: outName(file.name, mode),
    note: 'pdf-note',
  };
}
