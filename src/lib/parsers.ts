/* File → plain text extractors. All client-side. */

export type ParsedFile = {
  kind: 'txt' | 'md' | 'json' | 'csv' | 'pdf' | 'docx' | 'xlsx';
  filename: string;
  text: string;
  note?: string;
};

export const ACCEPT =
  '.txt,.md,.markdown,.json,.csv,.tsv,.pdf,.docx,.xlsx,.xls,text/plain,application/json,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i + 1).toLowerCase();
}

async function readText(file: File): Promise<string> {
  return await file.text();
}

async function parsePdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  // Vite-friendly worker URL
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    const pageText = tc.items
      .map((it) => ('str' in it ? (it as { str: string }).str : ''))
      .join(' ');
    parts.push(pageText);
  }
  return parts.join('\n\n');
}

async function parseDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth/mammoth.browser');
  const buf = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer: buf });
  return res.value;
}

async function parseXlsx(file: File): Promise<string> {
  const XLSX = await import('xlsx');
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheets: string[] = [];
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const csv = XLSX.utils.sheet_to_csv(ws);
    sheets.push(`# ${name}\n${csv}`);
  }
  return sheets.join('\n\n');
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const ext = extOf(file.name);
  const filename = file.name;

  if (ext === 'pdf') {
    return { kind: 'pdf', filename, text: await parsePdf(file), note: 'PDF text extracted (formatting not preserved on export).' };
  }
  if (ext === 'docx') {
    return { kind: 'docx', filename, text: await parseDocx(file), note: 'Word text extracted (formatting not preserved on export).' };
  }
  if (ext === 'xlsx' || ext === 'xls') {
    return { kind: 'xlsx', filename, text: await parseXlsx(file), note: 'Spreadsheet flattened to CSV (one block per sheet).' };
  }
  if (ext === 'json') {
    const raw = await readText(file);
    try {
      const parsed = JSON.parse(raw);
      return { kind: 'json', filename, text: JSON.stringify(parsed, null, 2) };
    } catch {
      return { kind: 'json', filename, text: raw, note: 'Could not parse JSON; treated as plain text.' };
    }
  }
  if (ext === 'csv' || ext === 'tsv') {
    return { kind: 'csv', filename, text: await readText(file) };
  }
  if (ext === 'md' || ext === 'markdown') {
    return { kind: 'md', filename, text: await readText(file) };
  }
  return { kind: 'txt', filename, text: await readText(file) };
}

export function exportFilename(original: string, suffix: string): string {
  const i = original.lastIndexOf('.');
  const base = i < 0 ? original : original.slice(0, i);
  const ext = i < 0 ? '' : original.slice(i);
  const downgrade = ['.pdf', '.docx', '.xlsx', '.xls'].includes(ext.toLowerCase());
  return downgrade ? `${base}.${suffix}.txt` : `${base}.${suffix}${ext}`;
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
