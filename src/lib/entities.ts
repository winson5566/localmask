export type EntityType =
  | 'private_person'
  | 'private_email'
  | 'private_phone'
  | 'private_address'
  | 'private_url'
  | 'private_date'
  | 'account_number'
  | 'secret';

export interface Entity {
  start: number;
  end: number;
  type: EntityType;
  score: number;
  word: string;
}

export const ENTITY_TOKEN: Record<EntityType, string> = {
  private_person: '[PERSON]',
  private_email: '[EMAIL]',
  private_phone: '[PHONE]',
  private_address: '[ADDRESS]',
  private_url: '[URL]',
  private_date: '[DATE]',
  account_number: '[ACCOUNT]',
  secret: '[SECRET]',
};

export const ENTITY_TYPES: EntityType[] = [
  'private_person',
  'private_email',
  'private_phone',
  'private_address',
  'private_url',
  'private_date',
  'account_number',
  'secret',
];

/** Apply substitutions to text. Entities must be sorted, non-overlapping. */
export function applyMask(text: string, entities: Entity[]): string {
  if (!entities.length) return text;
  const sorted = [...entities].sort((a, b) => a.start - b.start);
  let out = '';
  let cursor = 0;
  for (const e of sorted) {
    if (e.start < cursor) continue;
    out += text.slice(cursor, e.start);
    out += ENTITY_TOKEN[e.type];
    cursor = e.end;
  }
  out += text.slice(cursor);
  return out;
}

export function applyRedact(text: string, entities: Entity[]): string {
  if (!entities.length) return text;
  const sorted = [...entities].sort((a, b) => a.start - b.start);
  let out = '';
  let cursor = 0;
  for (const e of sorted) {
    if (e.start < cursor) continue;
    out += text.slice(cursor, e.start);
    const len = Math.max(3, e.end - e.start);
    out += '█'.repeat(len);
    cursor = e.end;
  }
  out += text.slice(cursor);
  return out;
}

/** Normalize a raw transformers.js output into Entity[] with absolute offsets. */
export function normalizeOutput(
  raw: Array<{ entity_group?: string; entity?: string; score: number; word: string; start?: number; end?: number }>,
  fullText: string,
): Entity[] {
  const out: Entity[] = [];
  for (const r of raw) {
    const type = (r.entity_group ?? r.entity ?? '').replace(/^[BIES]-/, '') as EntityType;
    if (!ENTITY_TYPES.includes(type)) continue;
    let start = r.start;
    let end = r.end;
    if (start == null || end == null) {
      const idx = fullText.indexOf(r.word.trim());
      if (idx < 0) continue;
      start = idx;
      end = idx + r.word.trim().length;
    }
    out.push({ start, end, type, score: r.score, word: fullText.slice(start, end) });
  }
  return out.sort((a, b) => a.start - b.start);
}
