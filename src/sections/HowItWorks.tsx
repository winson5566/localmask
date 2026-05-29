import { useLang } from '../lib/i18n';

export function HowItWorks() {
  const { t } = useLang();
  const steps = t.how.steps.map((s, i) => ({ n: `0${i + 1}`, ...s }));
  return (
    <section id="how" className="px-6 lg:px-8 py-24 lg:py-32 border-t border-[color:var(--color-border)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium leading-[1.1]">
            {t.how.h2}
          </h2>
          <p className="mt-5 text-[color:var(--color-text-muted)] leading-relaxed max-w-[46ch]">
            {t.how.lede}
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
