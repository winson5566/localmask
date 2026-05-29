import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DownloadSimple, FileText, Sparkle, UploadSimple, X } from '@phosphor-icons/react';
import { useFilter } from '../lib/useFilter';
import { ENTITY_LABEL, ENTITY_TYPES, applyMask, applyRedact, type EntityType } from '../lib/entities';
import { ACCEPT, downloadText, exportFilename, parseFile, type ParsedFile } from '../lib/parsers';
import { StatusPill } from '../components/StatusPill';
import { EntityRender } from '../components/EntityRender';

const SAMPLE_TEXT = `Hi Dr. Granger,

This is Harry Potter (harry.potter@hogwarts.edu). I wanted to confirm my appointment on March 14, 2026. You can reach me at +44 20 7946 0958, or by post at 4 Privet Drive, Little Whinging, Surrey.

For the records transfer, please use the temporary token sk-proj-Vc9Xq2bNh8ZzPm and send a confirmation to https://hogwarts.internal/records/transfer. The card on file ending 4242 4242 4242 4242 is still active.

Best,
Harry`;

type Mode = 'view' | 'mask' | 'redact';

export function Workbench() {
  const filter = useFilter();
  const [tab, setTab] = useState<'text' | 'file'>('text');
  const [text, setText] = useState(SAMPLE_TEXT);
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [mode, setMode] = useState<Mode>('view');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const runId = useRef(0);

  const inputText = tab === 'text' ? text : parsed?.text ?? '';
  const charCount = inputText.length;
  const wordCount = useMemo(() => (inputText.trim() ? inputText.trim().split(/\s+/).length : 0), [inputText]);

  // Auto-load model on first mount.
  useEffect(() => {
    filter.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-run when ready and input changes.
  useEffect(() => {
    if (!inputText.trim()) return;
    if (filter.status !== 'ready' && filter.status !== 'inferring') return;
    const id = ++runId.current;
    const t = setTimeout(() => {
      if (id !== runId.current) return;
      filter.run(inputText).catch(() => { /* surfaced via error */ });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, filter.status]);

  const onFile = useCallback(async (file: File) => {
    try {
      const p = await parseFile(file);
      setParsed(p);
      setTab('file');
    } catch (err) {
      console.error(err);
      alert(`Could not parse ${file.name}: ${(err as Error).message}`);
    }
  }, []);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) await onFile(f);
    },
    [onFile],
  );

  const handleExport = useCallback(() => {
    const out = mode === 'mask' ? applyMask(inputText, filter.entities) : mode === 'redact' ? applyRedact(inputText, filter.entities) : inputText;
    const original = tab === 'file' && parsed ? parsed.filename : 'localmask-output.txt';
    const suffix = mode === 'view' ? 'annotated' : mode;
    downloadText(exportFilename(original, suffix), out);
  }, [mode, inputText, filter.entities, tab, parsed]);

  const counts = useMemo(() => {
    const m = new Map<EntityType, number>();
    for (const e of filter.entities) m.set(e.type, (m.get(e.type) ?? 0) + 1);
    return m;
  }, [filter.entities]);

  const isReady = filter.status === 'ready' || filter.status === 'inferring';

  return (
    <section id="workbench" className="px-6 lg:px-8 py-16 lg:py-20 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl tracking-tight font-medium">Workbench</h2>
            <p className="mt-2 text-[color:var(--color-text-muted)] max-w-[60ch]">
              Paste text or drop a file. The model loads once, runs locally, and never sees the network after the initial download.
            </p>
          </div>
          <StatusPill status={filter.status} device={filter.device} progress={filter.progress} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[color:var(--color-border)] rounded-lg overflow-hidden border border-[color:var(--color-border)]">
          {/* INPUT */}
          <div className="bg-[color:var(--color-bg)] flex flex-col min-h-[560px]">
            <div className="flex items-center justify-between px-4 h-12 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-[color:var(--color-surface-3)] border border-[color:var(--color-border)]">
                <button
                  onClick={() => setTab('text')}
                  className={`px-3 h-7 text-xs font-medium rounded transition-colors ${tab === 'text' ? 'bg-[color:var(--color-surface)] text-[color:var(--color-text)]' : 'text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]'}`}
                >
                  Paste text
                </button>
                <button
                  onClick={() => setTab('file')}
                  className={`px-3 h-7 text-xs font-medium rounded transition-colors ${tab === 'file' ? 'bg-[color:var(--color-surface)] text-[color:var(--color-text)]' : 'text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]'}`}
                >
                  Upload file
                </button>
              </div>
              <div className="font-mono text-[10.5px] text-[color:var(--color-text-dim)] num">
                {wordCount} words · {charCount.toLocaleString()} chars
              </div>
            </div>

            {tab === 'text' ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste any text containing names, emails, addresses, keys, or other identifiers…"
                className="flex-1 w-full p-5 bg-transparent text-[15px] leading-[1.7] resize-none focus:outline-none placeholder:text-[color:var(--color-text-dim)]"
                spellCheck={false}
              />
            ) : (
              <div
                className="flex-1 flex flex-col"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                {parsed ? (
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText size={16} className="shrink-0 text-[color:var(--color-text-muted)]" />
                        <div className="min-w-0">
                          <div className="truncate text-sm">{parsed.filename}</div>
                          <div className="font-mono text-[10.5px] text-[color:var(--color-text-dim)] uppercase tracking-[0.18em] mt-0.5">
                            {parsed.kind} · {parsed.text.length.toLocaleString()} chars
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setParsed(null); setTab('text'); }}
                        className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] transition-colors"
                        aria-label="Clear file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {parsed.note && (
                      <div className="px-5 py-2 text-[11px] text-[color:var(--color-text-muted)] border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30">
                        Note: {parsed.note}
                      </div>
                    )}
                    <pre className="flex-1 overflow-auto p-5 text-[13px] leading-[1.6] font-mono text-[color:var(--color-text-muted)] whitespace-pre-wrap">
                      {parsed.text.slice(0, 5000)}
                      {parsed.text.length > 5000 && <span className="text-[color:var(--color-text-dim)]">{`\n\n… ${(parsed.text.length - 5000).toLocaleString()} more chars`}</span>}
                    </pre>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={`flex-1 m-5 flex flex-col items-center justify-center rounded-md border border-dashed transition-colors ${dragOver ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]' : 'border-[color:var(--color-border-strong)] hover:border-[color:var(--color-text-muted)]'}`}
                  >
                    <UploadSimple size={26} weight="regular" className="text-[color:var(--color-text-muted)]" />
                    <div className="mt-4 text-sm">Drop a file or click to browse</div>
                    <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)]">
                      PDF · DOCX · XLSX · CSV · JSON · MD · TXT
                    </div>
                    <div className="mt-4 text-[11px] text-[color:var(--color-text-dim)]">Processed entirely in this tab</div>
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT}
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onFile(f);
                    e.target.value = '';
                  }}
                />
              </div>
            )}
          </div>

          {/* OUTPUT */}
          <div className="bg-[color:var(--color-bg)] flex flex-col min-h-[560px]">
            <div className="flex items-center justify-between px-4 h-12 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-[color:var(--color-surface-3)] border border-[color:var(--color-border)]">
                {(['view', 'mask', 'redact'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 h-7 text-xs font-medium rounded capitalize transition-colors ${mode === m ? 'bg-[color:var(--color-surface)] text-[color:var(--color-text)]' : 'text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]'}`}
                  >
                    {m === 'view' ? 'Highlight' : m === 'mask' ? 'Mask' : 'Redact'}
                  </button>
                ))}
              </div>
              <button
                onClick={handleExport}
                disabled={!filter.entities.length && mode === 'view'}
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded border border-[color:var(--color-border-strong)] text-xs hover:bg-[color:var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <DownloadSimple size={13} />
                Export
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {!isReady && filter.status !== 'error' ? (
                <div className="h-full flex items-center justify-center text-[color:var(--color-text-muted)]">
                  <div className="text-center">
                    <Sparkle size={22} className="mx-auto mb-3 opacity-60" />
                    <div className="text-sm">Model loading on first visit</div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)] mt-2">
                      ~700 MB · cached after
                    </div>
                  </div>
                </div>
              ) : filter.status === 'error' ? (
                <div className="text-sm text-red-400 max-w-[60ch]">
                  Model failed to load. {filter.error}
                  <br />
                  <span className="text-[color:var(--color-text-muted)]">
                    Tip: WebGPU works best in Chrome / Edge / latest Safari. Older browsers fall back to WASM which is slower but still functional.
                  </span>
                </div>
              ) : (
                <EntityRender text={inputText} entities={filter.entities} mode={mode} />
              )}
            </div>

            <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)] mr-1">
                {filter.entities.length} detected{filter.inferenceMs != null && ` · ${filter.inferenceMs}ms`}
              </div>
              {ENTITY_TYPES.map((t) => {
                const n = counts.get(t) ?? 0;
                if (!n) return null;
                return (
                  <span key={t} className="ent text-[12px]" data-type={t}>
                    {ENTITY_LABEL[t]} <span className="num text-[color:var(--color-text-muted)]">{n}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-[color:var(--color-text-dim)] max-w-[80ch]">
          Output formats: text, Markdown, JSON, CSV, and TSV export to their original format with substitutions applied.
          PDF, Word, and Excel files are flattened to plain text on export because rewriting the original layout in-browser is out of scope.
        </p>
      </div>
    </section>
  );
}
