import { ENTITY_DESC, ENTITY_LABEL, ENTITY_TYPES } from '../lib/entities';

export function Model() {
  return (
    <section id="model" className="px-6 lg:px-8 py-24 lg:py-32 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 max-w-[60ch]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)] mb-4">
            The model
          </div>
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium leading-[1.1]">
            A bidirectional classifier, not a chatbot.
          </h2>
          <p className="mt-5 text-[color:var(--color-text-muted)] leading-relaxed">
            OpenAI Privacy Filter is a token-classification model adapted from a gpt-oss-style autoregressive checkpoint. Instead of generating text, it labels every token in a single forward pass and decodes coherent spans with a constrained Viterbi procedure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Architecture (large) */}
          <div className="md:col-span-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:p-8">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)]">
              Architecture
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5 font-mono text-[13px]">
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">Type</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">Bidirectional token classifier</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">Backbone</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">Pre-norm transformer, 8 blocks</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">Attention</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">GQA · 14 Q heads / 2 KV heads · RoPE · banded (window 257)</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">FFN</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">Sparse MoE · 128 experts · top-4 routing</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">Width</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">d_model = 640</div>
              </div>
              <div>
                <div className="text-[color:var(--color-text-dim)] text-[11px] uppercase tracking-[0.18em]">Output head</div>
                <div className="mt-1.5 text-[color:var(--color-text)]">33 classes (1 O + 8 × BIOES)</div>
              </div>
            </div>
          </div>

          {/* Headline stats */}
          <div className="md:col-span-2 rounded-lg border border-[color:var(--color-border)] bg-gradient-to-br from-[color:var(--color-accent-soft)] to-transparent p-6 md:p-8 flex flex-col justify-between">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)]">
              At a glance
            </div>
            <div className="mt-6 space-y-5">
              <div>
                <div className="text-3xl md:text-4xl font-medium num tracking-tight">1.5B<span className="text-base text-[color:var(--color-text-muted)] ml-1.5">total</span></div>
                <div className="font-mono text-[11px] text-[color:var(--color-text-muted)] mt-1">50M active per token</div>
              </div>
              <div className="h-px bg-[color:var(--color-border)]" />
              <div>
                <div className="text-3xl md:text-4xl font-medium num tracking-tight">128k</div>
                <div className="font-mono text-[11px] text-[color:var(--color-text-muted)] mt-1">context window, no chunking</div>
              </div>
              <div className="h-px bg-[color:var(--color-border)]" />
              <div>
                <div className="text-3xl md:text-4xl font-medium num tracking-tight">8</div>
                <div className="font-mono text-[11px] text-[color:var(--color-text-muted)] mt-1">privacy span categories</div>
              </div>
            </div>
          </div>

          {/* Entity taxonomy */}
          <div className="md:col-span-6 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:p-8">
            <div className="flex items-baseline justify-between mb-5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)]">
                Detected entities
              </div>
              <div className="font-mono text-[10.5px] text-[color:var(--color-text-dim)]">8 classes</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
              {ENTITY_TYPES.map((t) => (
                <div key={t} className="flex gap-3">
                  <span className="ent shrink-0 h-fit" data-type={t}>{ENTITY_LABEL[t]}</span>
                  <p className="text-sm text-[color:var(--color-text-muted)] leading-snug">{ENTITY_DESC[t]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
