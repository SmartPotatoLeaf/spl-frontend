import {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import OptimizedImage from '../shared/OptimizedImage';

export default function Problem() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // Hover effect con GSAP para cada card
      Array.from(cards).forEach((card) => {
        const cardElement = card as HTMLElement;

        cardElement.addEventListener('mouseenter', () => {
          gsap.to(cardElement, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        cardElement.addEventListener('mouseleave', () => {
          gsap.to(cardElement, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="problema" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-state-idle mb-4">
            {t('landing.problem.title')} <span className="text-error">{t('landing.problem.titleHighlight')}</span>
          </h2>
          <p className="text-lg sm:text-xl text-state-idle/70">
            {t('landing.problem.subtitle')}
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer flex flex-col h-full">
            <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433"
                  alt="Hojas de papa con tizón tardío"
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                  aspectRatio="4/3"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-error/90 via-error/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-3">
                <i className="fas fa-exclamation-circle text-2xl text-white"></i>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col grow">
              <h3 className="text-xl sm:text-2xl font-bold text-state-idle mb-3">{t('landing.problem.card1Title')}</h3>
              <p className="text-state-idle/70 leading-relaxed">
                {t('landing.problem.card1Description')}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer flex flex-col h-full">
            <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399"
                  alt="Campo de papa afectado"
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                  aspectRatio="4/3"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-tag-mid/90 via-tag-mid/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-3">
                <i className="fas fa-clock text-2xl text-white"></i>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col grow">
              <h3 className="text-xl sm:text-2xl font-bold text-state-idle mb-3">{t('landing.problem.card2Title')}</h3>
              <p className="text-state-idle/70 leading-relaxed">
                {t('landing.problem.card2Description')}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer flex flex-col h-full">
            <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
                  alt="Agricultor preocupado inspeccionando cultivo"
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                  aspectRatio="4/3"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-tag-remote/90 via-tag-remote/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-3">
                <i className="fas fa-chart-line-down text-2xl text-white"></i>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col grow">
              <h3 className="text-xl sm:text-2xl font-bold text-state-idle mb-3">{t('landing.problem.card3Title')}</h3>
              <p className="text-state-idle/70 leading-relaxed">
                {t('landing.problem.card3Description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
