import I18nProvider from '@/i18n/I18nProvider';
import Hero from './Hero';
import Problem from './Problem';
import Solution from './Solution';
import Features from './Features';
import Stats from './Stats';
import CTA from './CTA';

export default function LandingPage() {
  return (
    <I18nProvider>
      <main className="min-h-screen bg-white">
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <Stats />
        <CTA />
      </main>
    </I18nProvider>
  );
}
