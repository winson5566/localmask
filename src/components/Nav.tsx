import { GithubLogo } from '@phosphor-icons/react';
import { useLang } from '../lib/i18n';

export function Nav() {
  const { lang, setLang, t } = useLang();
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--color-bg)]/70 border-b border-[color:var(--color-border)]">
      <div className="max-w-[1400px] mx-auto h-16 px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="w-6 h-6 rounded-md border border-[color:var(--color-border-strong)] flex items-center justify-center">
            <span className="w-2 h-2 rounded-sm bg-[color:var(--color-accent)] group-hover:bg-[color:var(--color-accent-hover)] transition-colors" />
          </span>
          <span className="font-medium tracking-tight">LocalMask</span>
          <span className="font-mono text-[10.5px] text-[color:var(--color-text-dim)] uppercase tracking-[0.18em] ml-1 hidden sm:inline">v0.1</span>
        </a>
        <div className="flex items-center gap-6 text-sm text-[color:var(--color-text-muted)]">
          <a href="#workbench" className="hover:text-[color:var(--color-text)] transition-colors">{t.nav.workbench}</a>
          <a href="#how" className="hover:text-[color:var(--color-text)] transition-colors hidden sm:inline">{t.nav.how}</a>
          <a
            href="https://github.com/winson5566/localmask"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[color:var(--color-text)] transition-colors"
            aria-label="LocalMask on GitHub"
          >
            <GithubLogo size={16} weight="regular" />
            <span className="hidden sm:inline">{t.nav.repo}</span>
          </a>
          <div className="flex items-center p-0.5 rounded-md bg-[color:var(--color-surface-3)] border border-[color:var(--color-border)]">
            {(['en', 'zh'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 h-6 text-[11px] font-medium rounded transition-colors ${lang === l ? 'bg-[color:var(--color-surface)] text-[color:var(--color-text)]' : 'text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]'}`}
                aria-pressed={lang === l}
              >
                {l === 'en' ? 'EN' : '中文'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
