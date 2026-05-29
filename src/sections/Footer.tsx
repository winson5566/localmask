import { useLang } from '../lib/i18n';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-[color:var(--color-border)] px-6 lg:px-8 py-10">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-dim)]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-sm bg-[color:var(--color-accent)]" />
          <span>LocalMask</span>
          <span>·</span>
          <span>{t.footer.tagline}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="https://huggingface.co/openai/privacy-filter" target="_blank" rel="noreferrer" className="hover:text-[color:var(--color-text)] transition-colors">
            {t.footer.modelHF}
          </a>
          <a href="https://github.com/openai/privacy-filter" target="_blank" rel="noreferrer" className="hover:text-[color:var(--color-text)] transition-colors">
            {t.footer.repo}
          </a>
          <a href="https://cdn.openai.com/pdf/c66281ed-b638-456a-8ce1-97e9f5264a90/OpenAI-Privacy-Filter-Model-Card.pdf" target="_blank" rel="noreferrer" className="hover:text-[color:var(--color-text)] transition-colors">
            {t.footer.modelCard}
          </a>
          <span className="text-[color:var(--color-text-dim)]/60">Apache 2.0</span>
        </div>
      </div>
    </footer>
  );
}
