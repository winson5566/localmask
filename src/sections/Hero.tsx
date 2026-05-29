import { ArrowDown } from '@phosphor-icons/react';
import { useLang } from '../lib/i18n';

export function Hero() {
  const { t } = useLang();
  return (
    <section className="relative pt-20 pb-24 lg:pt-24 lg:pb-32 px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: copy */}
        <div className="lg:col-span-7">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] leading-[1.02] text-grad-accent">
            {t.hero.h1a}
            <br />
            {t.hero.h1b}
          </h1>
          <p className="mt-7 text-lg text-[color:var(--color-text-muted)] leading-relaxed max-w-[58ch]">
            {t.hero.lede}
          </p>
          <div className="mt-9 flex items-center gap-4">
            <a
              href="#workbench"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-[color:var(--color-accent)] text-[#06281e] font-medium text-sm hover:bg-[color:var(--color-accent-hover)] transition-colors"
            >
              {t.hero.ctaPrimary}
              <ArrowDown size={14} weight="bold" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-md border border-[color:var(--color-border-strong)] text-sm text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)] transition-colors"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="lg:col-span-5 lg:pt-2">
          <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden">
            <div className="flex items-center justify-between px-4 h-10 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)]">
                {t.hero.previewTitle}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] animate-pulse" />
                <span className="font-mono text-[10.5px] text-[color:var(--color-text-muted)]">{t.hero.live}</span>
              </div>
            </div>
            <div className="p-5 text-[15px] leading-[1.75] text-[color:var(--color-text)]">
              {t.hero.from}{' '}
              <span className="ent" data-type="private_person">Harry Potter</span>{' '}
              &lt;<span className="ent" data-type="private_email">harry.potter@hogwarts.edu</span>&gt;
              <br />
              {t.hero.date}{' '}
              <span className="ent" data-type="private_date">March 14, 2026</span>
              <br />
              {t.hero.phone}{' '}
              <span className="ent" data-type="private_phone">+44 20 7946 0958</span>
              <br />
              {t.hero.address}{' '}
              <span className="ent" data-type="private_address">4 Privet Drive, Little Whinging, Surrey</span>
              <br />
              <br />
              {t.hero.body1}{' '}
              <span className="ent" data-type="secret">sk-proj-Vc9Xq2bNh8ZzPm</span>
              {' '}{t.hero.body2}{' '}
              <span className="ent" data-type="private_url">https://hogwarts.internal/legacy/hook</span>
              {' '}{t.hero.body3}
              <br />
              <br />
              {t.hero.body4}{' '}
              <span className="ent" data-type="account_number">4242 4242 4242 4242</span>{' '}{t.hero.body5}
            </div>
            <div className="px-4 h-10 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] flex items-center justify-between font-mono text-[10.5px] text-[color:var(--color-text-muted)]">
              <span>{t.hero.entitiesDetected}</span>
              <span>person · email · phone · address · secret · url · account</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
