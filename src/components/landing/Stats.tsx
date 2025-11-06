import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OptimizedImage from '../shared/OptimizedImage';

export default function Stats() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLUListElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Registrar plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animación del título y contenido
    const title = contentRef.current?.querySelector('h2');
    const subtitle = contentRef.current?.querySelector('p');
    
    if (title) {
      gsap.from(title, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        x: -80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    if (subtitle) {
      gsap.from(subtitle, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        x: -60,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      });
    }

    // Animación de los beneficios con checkmarks animados
    const benefits = benefitsRef.current?.children;
    if (benefits) {
      Array.from(benefits).forEach((benefit, index) => {
        const checkmark = benefit.querySelector('span:first-child');
        const text = benefit.querySelector('span:last-child');
        
        // Animar beneficio
        gsap.from(benefit, {
          scrollTrigger: {
            trigger: benefit,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          x: -40,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out'
        });

        // Animar checkmark con bounce
        gsap.from(checkmark, {
          scrollTrigger: {
            trigger: benefit,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          scale: 0,
          rotation: 360,
          duration: 0.5,
          delay: index * 0.1 + 0.3,
          ease: 'back.out(2)'
        });
      });
    }

    // Animación de las stat cards con counter animation
    const statCards = statsGridRef.current?.children;
    if (statCards) {
      Array.from(statCards).forEach((card, index) => {
        const cardElement = card as HTMLElement;
        const valueElement = cardElement.querySelector('p:first-child');
        
        // Entrada de la card
        gsap.from(cardElement, {
          scrollTrigger: {
            trigger: cardElement,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          scale: 0.7,
          rotation: -5,
          opacity: 0,
          duration: 0.7,
          delay: index * 0.15,
          ease: 'back.out(1.7)'
        });

        // Counter animation para el valor
        if (valueElement) {
          const text = valueElement.textContent || '';
          const numberMatch = text.match(/\d+/);
          
          if (numberMatch) {
            const targetValue = parseInt(numberMatch[0]);
            const suffix = text.replace(numberMatch[0], '').trim();
            
            gsap.from({ value: 0 }, {
              scrollTrigger: {
                trigger: cardElement,
                start: 'top 85%',
                toggleActions: 'play none none none'
              },
              value: targetValue,
              duration: 2,
              delay: index * 0.15 + 0.5,
              ease: 'power2.out',
              onUpdate: function() {
                const currentValue = Math.floor(this.targets()[0].value);
                valueElement.textContent = `${currentValue}${suffix}`;
              }
            });
          }
        }

        // Hover effect con brillo
        cardElement.addEventListener('mouseenter', () => {
          gsap.to(cardElement, {
            scale: 1.08,
            y: -8,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        cardElement.addEventListener('mouseleave', () => {
          gsap.to(cardElement, {
            scale: 1,
            y: 0,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    }

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="estadisticas" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-10">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1589669896200-39e4852d8cc6"
                alt="Agricultura en Perú con montañas"
                className="w-full"
                width={600}
                height={800}
                aspectRatio="3/4"
              />
            </div>

            {/* Content */}
            <div ref={contentRef} className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-state-idle mb-6">
                {t('landing.stats.title')} <span className="text-primary">{t('landing.stats.titleHighlight')}</span>
              </h2>
              <p className="text-base sm:text-lg text-state-idle/70 mb-8 leading-relaxed">
                {t('landing.stats.subtitle')}
              </p>
              <ul ref={benefitsRef} className="space-y-4">
                <li className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xl sm:text-2xl">✓</span>
                  <span className="text-state-idle font-medium text-sm sm:text-base">{t('landing.stats.benefit1')}</span>
                </li>
                <li className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xl sm:text-2xl">✓</span>
                  <span className="text-state-idle font-medium text-sm sm:text-base">{t('landing.stats.benefit2')}</span>
                </li>
                <li className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xl sm:text-2xl">✓</span>
                  <span className="text-state-idle font-medium text-sm sm:text-base">{t('landing.stats.benefit3')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div ref={statsGridRef} className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-linear-to-br from-primary to-primary/80 rounded-xl p-6 sm:p-8 text-white text-center cursor-pointer">
              <p className="text-3xl sm:text-4xl font-bold mb-2">{t('landing.stats.stat1Value')}</p>
              <p className="text-xs sm:text-sm opacity-90">{t('landing.stats.stat1Label')}</p>
            </div>
            <div className="bg-linear-to-br from-tag-mid to-tag-mid/80 rounded-xl p-6 sm:p-8 text-white text-center cursor-pointer">
              <p className="text-3xl sm:text-4xl font-bold mb-2">{t('landing.stats.stat2Value')}</p>
              <p className="text-xs sm:text-sm opacity-90">{t('landing.stats.stat2Label')}</p>
            </div>
            <div className="bg-linear-to-br from-tag-healthy to-tag-healthy/80 rounded-xl p-6 sm:p-8 text-white text-center cursor-pointer">
              <p className="text-3xl sm:text-4xl font-bold mb-2">{t('landing.stats.stat3Value')}</p>
              <p className="text-xs sm:text-sm opacity-90">{t('landing.stats.stat3Label')}</p>
            </div>
            <div className="bg-linear-to-br from-tag-remote to-tag-remote/80 rounded-xl p-6 sm:p-8 text-white text-center cursor-pointer">
              <p className="text-3xl sm:text-4xl font-bold mb-2">{t('landing.stats.stat4Value')}</p>
              <p className="text-xs sm:text-sm opacity-90">{t('landing.stats.stat4Label')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
