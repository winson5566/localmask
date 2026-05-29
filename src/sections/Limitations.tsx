import { useLang } from '../lib/i18n';

export function Limitations() {
  const { t } = useLang();
  const items = t.limitations.items;
  return (
    <section id="limitations" className="px-6 lg:px-8 py-24 lg:py-32 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)] mb-4">
            {t.limitations.eyebrow}
          </div>
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium leading-[1.1]">
            {t.limitations.h2}
          </h2>
          <p className="mt-5 text-[color:var(--color-text-muted)] leading-relaxed max-w-[46ch]">
            {t.limitations.lede}
          </p>
        </div>

        <div className="lg:col-span-8 divide-y divide-[color:var(--color-border)]">
          {items.map((it, i) => (
            <div key={i} className={i === 0 ? 'pb-6 lg:pb-8' : i === items.length - 1 ? 'pt-6 lg:pt-8' : 'py-6 lg:py-8'}>
              <h3 className="text-base font-medium text-[color:var(--color-text)]">{it.title}</h3>
              <p className="mt-2 text-[color:var(--color-text-muted)] leading-relaxed">
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
