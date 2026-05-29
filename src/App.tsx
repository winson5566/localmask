import { Nav } from './components/Nav';
import { Hero } from './sections/Hero';
import { Workbench } from './sections/Workbench';
import { HowItWorks } from './sections/HowItWorks';
import { Formats } from './sections/Formats';
import { Footer } from './sections/Footer';
import { LangProvider } from './lib/i18n';

export default function App() {
  return (
    <LangProvider>
      <div className="relative min-h-[100dvh] bg-[color:var(--color-bg)] text-[color:var(--color-text)]">
        {/* Grain overlay — fixed, non-interactive */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] grain opacity-[0.5] mix-blend-multiply" />
        <Nav />
        <main>
          <Hero />
          <Workbench />
          <HowItWorks />
          <Formats />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
