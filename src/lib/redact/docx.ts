import { ENTITY_TOKEN, type Entity } from '../entities';
import type { DetectBatch, RedactMode } from './index';

const PART_RE = /^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/;

interface Run { el: Element; start: number; end: number }
interface Para { runs: Run[]; text: string }

/** Collect paragraphs (with per-run offset ranges) from one XML part. */
function collectParas(doc: Document): Para[] {
  const paras: Para[] = [];
  const pEls = doc.getElementsByTagName('w:p');
  for (let i = 0; i < pEls.length; i++) {
    const tEls = pEls[i].getElementsByTagName('w:t');
    if (!tEls.length) continue;
    const runs: Run[] = [];
    let text = '';
    for (let j = 0; j < tEls.length; j++) {
      const el = tEls[j];
      const s = el.textContent ?? '';
      runs.push({ el, start: text.length, end: text.length + s.length });
      text += s;
    }
    if (text) paras.push({ runs, text });
  }
  return paras;
}

function covered(entities: Entity[], g: number): Entity | undefined {
  return entities.find((e) => g >= e.start && g < e.end);
}

/** Rewrite each run's text given paragraph-level entities. */
function rewritePara(para: Para, entities: Entity[], mode: RedactMode) {
  for (const run of para.runs) {
    let out = '';
    for (let g = run.start; g < run.end; g++) {
      const e = covered(entities, g);
      const ch = para.text[g];
      if (!e) {
        out += ch;
      } else if (mode === 'redact') {
        out += '█';
      } else if (g === e.start) {
        out += ENTITY_TOKEN[e.type]; // place token once, in the run holding the start
      }
      // masked chars after the token are dropped
    }
    run.el.textContent = out;
    run.el.setAttribute('xml:space', 'preserve');
  }
}

export async function redactDocx(buf: ArrayBuffer, mode: RedactMode, detect: DetectBatch): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buf);
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  const partNames = Object.keys(zip.files).filter((n) => PART_RE.test(n));

  // Parse every relevant part and gather all paragraphs for one batch detection.
  const parsed: { name: string; doc: Document; paras: Para[] }[] = [];
  for (const name of partNames) {
    const xml = await zip.file(name)!.async('string');
    const doc = parser.parseFromString(xml, 'application/xml');
    const paras = collectParas(doc);
    if (paras.length) parsed.push({ name, doc, paras });
  }

  const allParas = parsed.flatMap((p) => p.paras);
  if (allParas.length) {
    const perPara = await detect(allParas.map((p) => p.text));
    for (let i = 0; i < allParas.length; i++) {
      const ents = perPara[i];
      if (ents && ents.length) rewritePara(allParas[i], ents, mode);
    }
    for (const part of parsed) {
      const xml = serializer.serializeToString(part.doc);
      zip.file(part.name, xml);
    }
  }

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}
