import { ENTITY_TYPES } from '../lib/entities';
import { useLang } from '../lib/i18n';

export function Model() {
  const { t } = useLang();
  const m = t.model;
  return (
    <section id="model" className="px-6 lg:px-8 py-24 lg:py-32 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 max-w-[60ch]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)] mb-4">
            {m.eyebrow}
          </div>
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium leading-[1.1]">
            {m.h2}
          </h2>
          <p className="mt-5 text-[color:var(--color-text-muted)] leading-relaxed">
            {m.lede}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Architecture (large) */}
          <div className="md:col-span-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:p-8">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)]">
              {m.archTitle}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5 font-mono text-[13px]">
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">{m.fType}</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">{m.vType}</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">{m.fBackbone}</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">{m.vBackbone}</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">{m.fAttention}</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">{m.vAttention}</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">{m.fFfn}</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">{m.vFfn}</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">{m.fWidth}</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">{m.vWidth}</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">{m.fHead}</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">{m.vHead}</div>
              </div>
            </div>
          </div>

          {/* Headline stats */}
          <div className="md:col-span-2 rounded-lg border border-[color:var(--color-border)] bg-gradient-to-br from-[color:var(--color-accent-soft)] to-transparent p-6 md:p-8 flex flex-col justify-between">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)]">
              {m.glance}
            </div>
            <div className="mt-6 space-y-5">
              <div>
                <div className="text-3xl md:text-4xl font-medium num tracking-tight">1.5B<span className="text-base text-[color:var(--color-text-muted)] ml-1.5">{m.total}</span></div>
                <div className="font-mono text-[11px] text-[color:var(--color-text-muted)] mt-1">{m.activePerToken}</div>
              </div>
              <div className="h-px bg-[color:var(--color-border)]" />
              <div>
                <div className="text-3xl md:text-4xl font-medium num tracking-tight">128k</div>
                <div className="font-mono text-[11px] text-[color:var(--color-text-muted)] mt-1">{m.contextWindow}</div>
              </div>
              <div className="h-px bg-[color:var(--color-border)]" />
              <div>
                <div className="text-3xl md:text-4xl font-medium num tracking-tight">8</div>
                <div className="font-mono text-[11px] text-[color:var(--color-text-muted)] mt-1">{m.spanCategories}</div>
              </div>
            </div>
          </div>

          {/* Entity taxonomy */}
          <div className="md:col-span-6 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:p-8">
            <div className="flex items-baseline justify-between mb-5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)]">
                {m.detectedEntities}
              </div>
              <div className="font-mono text-[10.5px] text-[color:var(--color-text-dim)]">{m.classes}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
              {ENTITY_TYPES.map((et) => (
                <div key={et} className="flex gap-3">
                  <span className="ent shrink-0 h-fit" data-type={et}>{t.entityLabel[et]}</span>
                  <p className="text-sm text-[color:var(--color-text-muted)] leading-snug">{t.entityDesc[et]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
