import { ENTITY_TOKEN } from '../entities';
import type { DetectBatch, RedactMode } from './index';

const RENDER_SCALE = 2; // device pixels per pt — higher = sharper, larger file

interface ItemRange { start: number; end: number; str: string; transform: number[]; width: number }
interface PageInfo {
  page: import('pdfjs-dist').PDFPageProxy;
  pageText: string;
  items: ItemRange[];
}

export async function redactPdf(buf: ArrayBuffer, mode: RedactMode, detect: DetectBatch): Promise<Blob> {
  const pdfjs = await import('pdfjs-dist');
  const PdfWorker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?worker')).default;
  pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker();
  const { jsPDF } = await import('jspdf');

  const doc = await pdfjs.getDocument({ data: buf }).promise;

  // Pass 1: extract text + per-item offsets for every page, then detect in one batch.
  const pages: PageInfo[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    const items: ItemRange[] = [];
    let text = '';
    for (const raw of tc.items) {
      if (!('str' in raw)) continue;
      const it = raw as { str: string; transform: number[]; width: number };
      const start = text.length;
      items.push({ start, end: start + it.str.length, str: it.str, transform: it.transform, width: it.width });
      text += it.str + ' ';
    }
    pages.push({ page, pageText: text, items });
  }

  const perPage = await detect(pages.map((p) => p.pageText));

  // Pass 2: render each page, paint boxes over entity items, assemble an image PDF.
  let out: import('jspdf').jsPDF | null = null;
  for (let i = 0; i < pages.length; i++) {
    const { page, items } = pages[i];
    const entities = perPage[i] ?? [];

    const vp1 = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: RENDER_SCALE });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(vp.width);
    canvas.height = Math.ceil(vp.height);
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;

    if (entities.length) {
      for (const it of items) {
        const hit = entities.find((e) => it.start < e.end && e.start < it.end);
        if (!hit) continue;
        const tx = pdfjs.Util.transform(vp.transform, it.transform);
        const fontH = Math.hypot(tx[2], tx[3]);
        const w = it.width * vp.scale;
        const x = tx[4];
        const y = tx[5] - fontH;
        if (mode === 'redact') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(x - 1, y - 1, w + 2, fontH + 2);
        } else {
          ctx.fillStyle = '#e5e7eb';
          ctx.fillRect(x - 1, y - 1, w + 2, fontH + 2);
          ctx.fillStyle = '#111111';
          ctx.font = `${Math.max(8, fontH * 0.72)}px sans-serif`;
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(ENTITY_TOKEN[hit.type], x + 1, y + fontH * 0.82, Math.max(w, 4));
        }
      }
    }

    const orientation = vp1.width > vp1.height ? 'l' : 'p';
    if (!out) out = new jsPDF({ unit: 'pt', format: [vp1.width, vp1.height], orientation });
    else out.addPage([vp1.width, vp1.height], orientation);
    out.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, vp1.width, vp1.height);
  }

  return out ? out.output('blob') : new Blob([], { type: 'application/pdf' });
}
