import { type Entity, ENTITY_LABEL, ENTITY_TOKEN } from '../lib/entities';

interface Props {
  text: string;
  entities: Entity[];
  mode: 'view' | 'mask' | 'redact';
}

export function EntityRender({ text, entities, mode }: Props) {
  if (!entities.length) {
    return <pre className="whitespace-pre-wrap font-sans text-[15px] leading-[1.7] text-[color:var(--color-text)]">{text}</pre>;
  }
  const sorted = [...entities].sort((a, b) => a.start - b.start);
  const parts: Array<{ kind: 'text' | 'ent'; content: string; ent?: Entity }> = [];
  let cursor = 0;
  for (const e of sorted) {
    if (e.start < cursor) continue;
    if (e.start > cursor) parts.push({ kind: 'text', content: text.slice(cursor, e.start) });
    parts.push({ kind: 'ent', content: text.slice(e.start, e.end), ent: e });
    cursor = e.end;
  }
  if (cursor < text.length) parts.push({ kind: 'text', content: text.slice(cursor) });

  return (
    <pre className="whitespace-pre-wrap font-sans text-[15px] leading-[1.75] text-[color:var(--color-text)]">
      {parts.map((p, i) => {
        if (p.kind === 'text') return <span key={i}>{p.content}</span>;
        const e = p.ent!;
        const label = `${ENTITY_LABEL[e.type]} · ${(e.score * 100).toFixed(1)}%`;
        if (mode === 'mask') {
          return (
            <span key={i} className="mask-token" title={label}>
              {ENTITY_TOKEN[e.type]}
            </span>
          );
        }
        if (mode === 'redact') {
          return (
            <span key={i} className="redact" title={label}>
              {'█'.repeat(Math.max(3, p.content.length))}
            </span>
          );
        }
        return (
          <span key={i} className="ent" data-type={e.type} title={label}>
            {p.content}
          </span>
        );
      })}
    </pre>
  );
}
