import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import OptimizedImage from '../shared/OptimizedImage';

export default function Solution() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useGSAP(() => {
    // Registrar plugin solo en el cliente
    gsap.registerPlugin(ScrollTrigger);

    // Animación del título
    gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animación stagger de las cards
    const cards = cardsRef.current?.children;
    if (cards) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Morphing border effect en hover
      Array.from(cards).forEach((card) => {
        const cardElement = card as HTMLElement;
        const innerCard = cardElement.querySelector('.group > div');

        cardElement.addEventListener('mouseenter', () => {
          gsap.to(cardElement, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
          });
          gsap.to(innerCard, {
            borderColor: 'var(--color-primary)',
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        cardElement.addEventListener('mouseleave', () => {
          gsap.to(cardElement, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
          gsap.to(innerCard, {
            borderColor: 'transparent',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    }

    // Animación del CTA
    gsap.from(ctaRef.current, {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.4)'
    });

  }, { scope: sectionRef });

  // Magnetic button effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaButtonRef.current || !ctaRef.current) return;

    const button = ctaButtonRef.current;
    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    // Magnetic effect radius
    const magnetRadius = 100;

    if (distance < magnetRadius) {
      const strength = (magnetRadius - distance) / magnetRadius;
      const moveX = distanceX * strength * 0.3;
      const moveY = distanceY * strength * 0.3;

      gsap.to(button, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (!ctaButtonRef.current) return;
    gsap.to(ctaButtonRef.current, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <section ref={sectionRef} id="solucion" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-state-idle mb-4">
            {t('landing.solution.title')} <span className="text-primary">{t('landing.solution.titleHighlight')}</span>
          </h2>
          <p className="text-lg sm:text-xl text-state-idle/70">{t('landing.solution.subtitle')}</p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Solution 1 */}
          <div className="group cursor-pointer h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-transparent flex flex-col h-full">
              <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
                <div className="absolute inset-0">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1556656793-08538906a9f8"
                    alt="Smartphone capturando foto de cultivo"
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                    aspectRatio="4/3"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-3">
                  <i className="fas fa-brain text-2xl text-white"></i>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col grow">
                <h3 className="text-xl sm:text-2xl font-bold text-state-idle mb-3">{t('landing.solution.card1Title')}</h3>
                <p className="text-state-idle/70 leading-relaxed">
                  {t('landing.solution.card1Description')}
                </p>
              </div>
            </div>
          </div>

          {/* Solution 2 */}
          <div className="group cursor-pointer h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-transparent flex flex-col h-full">
              <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
                <div className="absolute inset-0">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                    alt="Inteligencia artificial analizando datos"
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                    aspectRatio="4/3"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-3">
                  <i className="fas fa-mobile-alt text-2xl text-white"></i>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col grow">
                <h3 className="text-xl sm:text-2xl font-bold text-state-idle mb-3">{t('landing.solution.card2Title')}</h3>
                <p className="text-state-idle/70 leading-relaxed">
                  {t('landing.solution.card2Description')}
                </p>
              </div>
            </div>
          </div>

          {/* Solution 3 */}
          <div className="group cursor-pointer h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-transparent flex flex-col h-full">
              <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
                <div className="absolute inset-0">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
                    alt="Gráficos y análisis de datos agrícolas"
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                    aspectRatio="4/3"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-3">
                  <i className="fas fa-bolt text-2xl text-white"></i>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col grow">
                <h3 className="text-xl sm:text-2xl font-bold text-state-idle mb-3">{t('landing.solution.card3Title')}</h3>
                <p className="text-state-idle/70 leading-relaxed">
                  {t('landing.solution.card3Description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Big CTA */}
        <div
          ref={ctaRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-linear-to-r from-primary to-primary/80 rounded-2xl p-8 sm:p-12 text-white text-center"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{t('landing.solution.ctaTitle')}</h3>
          <p className="text-base sm:text-lg mb-6 opacity-90">{t('landing.solution.ctaSubtitle')}</p>
          <a
            ref={ctaButtonRef}
            href="/auth?mode=register"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 sm:px-8 py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {t('landing.solution.ctaButton')}
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
