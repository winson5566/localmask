const formats = [
  { ext: 'TXT', name: 'Plain text', engine: 'Native', roundtrip: true },
  { ext: 'MD', name: 'Markdown', engine: 'Native', roundtrip: true },
  { ext: 'JSON', name: 'JSON', engine: 'Native', roundtrip: true },
  { ext: 'CSV', name: 'Comma-separated', engine: 'Native', roundtrip: true },
  { ext: 'TSV', name: 'Tab-separated', engine: 'Native', roundtrip: true },
  { ext: 'PDF', name: 'PDF document', engine: 'pdf.js', roundtrip: false },
  { ext: 'DOCX', name: 'Word document', engine: 'Mammoth', roundtrip: false },
  { ext: 'XLSX', name: 'Excel workbook', engine: 'SheetJS', roundtrip: false },
];

export function Formats() {
  return (
    <section id="formats" className="px-6 lg:px-8 py-24 lg:py-32 border-t border-[color:var(--color-border)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium leading-[1.1]">
            Eight formats in, two formats out.
          </h2>
          <p className="mt-5 text-[color:var(--color-text-muted)] leading-relaxed max-w-[46ch]">
            Plain formats round-trip. Rich documents are parsed for analysis and exported as plain text so layout can never leak through.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formats.map((f) => (
              <div
                key={f.ext}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40 p-4 flex items-start gap-3"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] w-12 shrink-0 mt-0.5">
                  {f.ext}
                </div>
                <div className="min-w-0">
                  <div className="text-sm">{f.name}</div>
                  <div className="font-mono text-[10.5px] text-[color:var(--color-text-dim)] uppercase tracking-[0.18em] mt-1">
                    {f.engine} · {f.roundtrip ? 'same format out' : 'exports as .txt'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
