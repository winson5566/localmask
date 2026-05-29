import { ArrowDown } from '@phosphor-icons/react';

export function Hero() {
  return (
    <section className="relative pt-20 pb-24 lg:pt-24 lg:pb-32 px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: copy */}
        <div className="lg:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-text-dim)] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)]" />
            Open weights · Apache 2.0
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] leading-[1.02] text-grad-accent">
            Privacy never leaves
            <br />
            your device.
          </h1>
          <p className="mt-7 text-lg text-[color:var(--color-text-muted)] leading-relaxed max-w-[58ch]">
            LocalMask is a browser-native PII filter powered by OpenAI&apos;s open-weight Privacy Filter.
            Text, PDF, Word, and Excel are analyzed entirely on your machine. Nothing is uploaded.
          </p>
          <div className="mt-9 flex items-center gap-4">
            <a
              href="#workbench"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-[color:var(--color-accent)] text-[#06281e] font-medium text-sm hover:bg-[color:var(--color-accent-hover)] transition-colors"
            >
              Open the workbench
              <ArrowDown size={14} weight="bold" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-md border border-[color:var(--color-border-strong)] text-sm text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)] transition-colors"
            >
              How it works
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)]">Params</dt>
              <dd className="mt-1.5 num text-base text-[color:var(--color-text)]">1.5B<span className="text-[color:var(--color-text-muted)] text-xs ml-1">/ 50M active</span></dd>
            </div>
            <div>
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)]">Context</dt>
              <dd className="mt-1.5 num text-base text-[color:var(--color-text)]">128k<span className="text-[color:var(--color-text-muted)] text-xs ml-1">tokens</span></dd>
            </div>
            <div>
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)]">Classes</dt>
              <dd className="mt-1.5 num text-base text-[color:var(--color-text)]">8<span className="text-[color:var(--color-text-muted)] text-xs ml-1">entities</span></dd>
            </div>
          </dl>
        </div>

        {/* Right: live preview */}
        <div className="lg:col-span-5 lg:pt-2">
          <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden">
            <div className="flex items-center justify-between px-4 h-10 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)]">
                Preview · sample input
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] animate-pulse" />
                <span className="font-mono text-[10.5px] text-[color:var(--color-text-muted)]">Live</span>
              </div>
            </div>
            <div className="p-5 text-[15px] leading-[1.75] text-[color:var(--color-text)]">
              From:{' '}
              <span className="ent" data-type="private_person">Harry Potter</span>{' '}
              &lt;<span className="ent" data-type="private_email">harry.potter@hogwarts.edu</span>&gt;
              <br />
              Date:{' '}
              <span className="ent" data-type="private_date">March 14, 2026</span>
              <br />
              Phone:{' '}
              <span className="ent" data-type="private_phone">+44 20 7946 0958</span>
              <br />
              Address:{' '}
              <span className="ent" data-type="private_address">4 Privet Drive, Little Whinging, Surrey</span>
              <br />
              <br />
              Please rotate the API key{' '}
              <span className="ent" data-type="secret">sk-proj-Vc9Xq2bNh8ZzPm</span>
              {' '}before the audit. The legacy webhook at{' '}
              <span className="ent" data-type="private_url">https://hogwarts.internal/legacy/hook</span>
              {' '}is no longer in scope.
              <br />
              <br />
              Charge confirmation #{' '}
              <span className="ent" data-type="account_number">4242 4242 4242 4242</span>{' '}was processed.
            </div>
            <div className="px-4 h-10 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] flex items-center justify-between font-mono text-[10.5px] text-[color:var(--color-text-muted)]">
              <span>7 entities detected</span>
              <span>person · email · phone · address · secret · url · account</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
