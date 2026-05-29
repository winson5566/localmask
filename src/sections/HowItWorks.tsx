const steps = [
  {
    n: '01',
    title: 'The weights download once.',
    body:
      'On your first visit, the openai/privacy-filter ONNX weights (q4f16, around 700 MB) are fetched from Hugging Face and stored in your browser’s Cache Storage. After that, the page works offline.',
  },
  {
    n: '02',
    title: 'Files are parsed in this tab.',
    body:
      'PDFs go through pdf.js, Word documents through Mammoth, spreadsheets through SheetJS, and plain formats are read directly. No bytes leave the page.',
  },
  {
    n: '03',
    title: 'A Web Worker runs the model.',
    body:
      'Transformers.js hosts the classifier in a dedicated worker thread, on WebGPU when available, otherwise WASM. The main thread stays responsive while a single bidirectional pass labels every token.',
  },
  {
    n: '04',
    title: 'You decide what to do with it.',
    body:
      'Highlight to inspect, mask to replace each span with a typed placeholder for downstream pipelines, or redact to erase the span entirely. Export as a clean file when you are ready.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-6 lg:px-8 py-24 lg:py-32 border-t border-[color:var(--color-border)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium leading-[1.1]">
            On-device, end&nbsp;to&nbsp;end.
          </h2>
          <p className="mt-5 text-[color:var(--color-text-muted)] leading-relaxed max-w-[46ch]">
            Everything that touches your text runs in this browser tab. The lifecycle in four steps.
          </p>
        </div>

        <ol className="lg:col-span-8 divide-y divide-[color:var(--color-border)]">
          {steps.map((s) => (
            <li key={s.n} className="py-6 lg:py-8 grid grid-cols-12 gap-6 items-start">
              <div className="col-span-2 lg:col-span-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)] pt-1">
                {s.n}
              </div>
              <div className="col-span-10 lg:col-span-11">
                <h3 className="text-lg md:text-xl tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[color:var(--color-text-muted)] leading-relaxed max-w-[64ch]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
