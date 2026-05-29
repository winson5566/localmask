export function Limitations() {
  return (
    <section id="limitations" className="px-6 lg:px-8 py-24 lg:py-32 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)] mb-4">
            Model card excerpt
          </div>
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium leading-[1.1]">
            What this is not.
          </h2>
          <p className="mt-5 text-[color:var(--color-text-muted)] leading-relaxed max-w-[46ch]">
            Reading the model card carefully is part of using the model responsibly. The bullets below come directly from
            OpenAI&apos;s published limitations.
          </p>
        </div>

        <div className="lg:col-span-8 divide-y divide-[color:var(--color-border)]">
          <div className="pb-6 lg:pb-8">
            <h3 className="text-base font-medium text-[color:var(--color-text)]">A redaction aid, not an anonymization guarantee.</h3>
            <p className="mt-2 text-[color:var(--color-text-muted)] leading-relaxed">
              Privacy Filter is a data-minimization aid. Treating its output as proof of anonymization risks missing the actual privacy objective. Use it as one layer in a holistic privacy-by-design approach.
            </p>
          </div>

          <div className="py-6 lg:py-8">
            <h3 className="text-base font-medium text-[color:var(--color-text)]">A static label policy.</h3>
            <p className="mt-2 text-[color:var(--color-text-muted)] leading-relaxed">
              The model identifies eight categories of personal data. Real privacy use cases are more varied. Changing label boundaries requires fine-tuning the model, not configuration at runtime.
            </p>
          </div>

          <div className="py-6 lg:py-8">
            <h3 className="text-base font-medium text-[color:var(--color-text)]">Best in English, on Latin scripts.</h3>
            <p className="mt-2 text-[color:var(--color-text-muted)] leading-relaxed">
              Performance may drop on non-English text, non-Latin scripts, protected-group naming patterns, or domains that are out of distribution.
            </p>
          </div>

          <div className="py-6 lg:py-8">
            <h3 className="text-base font-medium text-[color:var(--color-text)]">Known failure modes.</h3>
            <p className="mt-2 text-[color:var(--color-text-muted)] leading-relaxed">
              Possible under-detection of uncommon names, regional naming conventions, initials, and domain-specific identifiers. Possible over-redaction of public entities, organizations, or benign high-entropy strings that resemble secrets. Fragmented spans in heavy-layout text.
            </p>
          </div>

          <div className="pt-6 lg:pt-8">
            <h3 className="text-base font-medium text-[color:var(--color-text)]">High-sensitivity workflows need human review.</h3>
            <p className="mt-2 text-[color:var(--color-text-muted)] leading-relaxed">
              Medical, legal, financial, HR, education, and government workflows carry real cost on both false negatives and false positives. Keep humans in the loop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
