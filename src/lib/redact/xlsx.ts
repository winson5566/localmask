import { applyMask, applyRedact } from '../entities';
import type { DetectBatch, RedactMode } from './index';

export async function redactXlsx(buf: ArrayBuffer, mode: RedactMode, detect: DetectBatch): Promise<Blob> {
  const XLSX = await import('xlsx');
  const wb = XLSX.read(buf, { type: 'array', cellStyles: true });

  // Collect every string cell so we can detect them in one batch.
  const targets: { ws: import('xlsx').WorkSheet; addr: string; text: string }[] = [];
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    if (!ws || !ws['!ref']) continue;
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const cell = ws[addr];
        if (cell && typeof cell.v === 'string' && cell.v.trim()) {
          targets.push({ ws, addr, text: cell.v });
        }
      }
    }
  }

  if (targets.length) {
    const perCell = await detect(targets.map((t) => t.text));
    for (let i = 0; i < targets.length; i++) {
      const ents = perCell[i];
      if (!ents || !ents.length) continue;
      const { ws, addr, text } = targets[i];
      const next = mode === 'mask' ? applyMask(text, ents) : applyRedact(text, ents);
      const cell = ws[addr];
      cell.v = next;
      cell.t = 's';
      delete cell.w; // force re-render of the formatted text
      delete cell.f; // drop any formula so the literal stays
    }
  }

  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx', cellStyles: true }) as ArrayBuffer;
  return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
