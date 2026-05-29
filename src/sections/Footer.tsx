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
        <a href="https://github.com/winson5566/localmask" target="_blank" rel="noreferrer" className="hover:text-[color:var(--color-text)] transition-colors">
          GitHub
        </a>
      </div>
    </footer>
  );
}
