import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import OptimizedImage from '../shared/OptimizedImage';

export default function Hero() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stat1ValueRef = useRef<HTMLParagraphElement>(null);
  const stat2ValueRef = useRef<HTMLParagraphElement>(null);

  // Animaciones GSAP
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Título con fade + slide up
    tl.from(titleRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 0.2
    })
    // Descripción
    .from(descRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8
    }, '-=0.6')
    // Botones CTA
    .from(ctaRef.current?.children || [], {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15
    }, '-=0.4')
    // Stats con counter animation
    .from(statsRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6
    }, '-=0.3')
    // Card visual con scale
    .from(cardRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.4)'
    }, '-=0.8');

    // Counter animation para stats
    const animateCounter = (element: HTMLElement | null, targetText: string) => {
      if (!element) return;
      
      const isPercentage = targetText.includes('%');
      const targetValue = parseInt(targetText.replace(/\D/g, ''));
      
      gsap.from({ value: 0 }, {
        value: targetValue,
        duration: 2,
        delay: 0.8,
        ease: 'power2.out',
        onUpdate: function() {
          const currentValue = Math.floor(this.targets()[0].value);
          element.textContent = isPercentage ? `${currentValue}%` : `${currentValue}hrs`;
        }
      });
    };

    animateCounter(stat1ValueRef.current, t('landing.hero.stat1Value'));
    animateCounter(stat2ValueRef.current, t('landing.hero.stat2Value'));

    // Hover effect en botones
    const buttons = ctaRef.current?.querySelectorAll('a, button');
    buttons?.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
      });
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="inicio" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl font-bold text-state-idle mb-6 leading-tight">
              {t('landing.hero.title')} <span className="text-primary">{t('landing.hero.titleHighlight')}</span>
            </h1>
            <p ref={descRef} className="text-lg sm:text-xl text-state-idle/70 mb-8 leading-relaxed">
              {t('landing.hero.description')}
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <a
                href="/auth"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group"
              >
                {t('landing.hero.ctaLogin')}
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </a>
              <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-gray-50 transition-colors">
                {t('landing.hero.ctaDemo')}
              </button>
            </div>

            <div ref={statsRef} className="mt-12 flex gap-8">
              <div>
                <p ref={stat1ValueRef} className="text-2xl sm:text-3xl font-bold text-state-idle">{t('landing.hero.stat1Value')}</p>
                <p className="text-sm sm:text-base text-state-idle/70">{t('landing.hero.stat1Label')}</p>
              </div>
              <div>
                <p ref={stat2ValueRef} className="text-2xl sm:text-3xl font-bold text-state-idle">{t('landing.hero.stat2Value')}</p>
                <p className="text-sm sm:text-base text-state-idle/70">{t('landing.hero.stat2Label')}</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden md:flex items-center justify-center">
            <div ref={cardRef} className="relative w-full max-w-md">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl blur-2xl"></div>
              
              {/* Main card with image */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-primary/20 transition-shadow duration-500">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
                    alt="Agricultor inspeccionando hojas de papa"
                    className="w-full"
                    width={600}
                    height={400}
                    aspectRatio="3/2"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent"></div>
                  
                  {/* Icon floating */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-3">
                    <i className="fas fa-leaf text-3xl text-white"></i>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 bg-linear-to-br from-primary to-primary/80 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <i className="fas fa-check-circle text-xl"></i>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">{t('landing.hero.cardTitle')}</p>
                      <p className="text-lg font-bold">{t('landing.hero.cardStatus')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs opacity-80">{t('landing.hero.cardStatusLabel')}</p>
                      <p className="text-xl font-bold">✓ {t('landing.hero.cardConfidence')}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs opacity-80">{t('landing.hero.cardLocationLabel')}</p>
                      <p className="text-sm">{t('landing.hero.cardLocation')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
