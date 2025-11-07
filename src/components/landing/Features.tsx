import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OptimizedImage from '../shared/OptimizedImage';

export default function Features() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const featuresListRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Registrar plugin
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

    // Animación stagger de las features con checkmarks
    const featureItems = featuresListRef.current?.children;
    if (featureItems) {
      Array.from(featureItems).forEach((item, index) => {
        const icon = item.querySelector('i');
        const content = item.querySelector('div');
        
        // Animar el item
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          x: -50,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.15,
          ease: 'power2.out'
        });

        // Animar el checkmark (draw effect simulado)
        gsap.from(icon, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          scale: 0,
          rotation: -180,
          duration: 0.5,
          delay: index * 0.15 + 0.2,
          ease: 'back.out(1.7)'
        });
      });
    }

    // Animación de la imagen con parallax suave
    gsap.from(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Parallax effect en la imagen
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -30,
      ease: 'none'
    });

    // Animación de las stat cards con stagger y counter
    const statCards = statsGridRef.current?.children;
    if (statCards) {
      Array.from(statCards).forEach((card, index) => {
        const cardElement = card as HTMLElement;
        
        // Animación de entrada
        gsap.from(cardElement, {
          scrollTrigger: {
            trigger: cardElement,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          scale: 0.8,
          y: 50,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'back.out(1.4)'
        });

        // Hover effect
        cardElement.addEventListener('mouseenter', () => {
          gsap.to(cardElement, {
            scale: 1.05,
            y: -5,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        cardElement.addEventListener('mouseleave', () => {
          gsap.to(cardElement, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    }

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="caracteristicas" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-state-idle mb-4">{t('landing.features.title')}</h2>
          <p className="text-lg sm:text-xl text-state-idle/70">{t('landing.features.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div ref={featuresListRef} className="space-y-6">
            <div className="flex gap-4 cursor-pointer">
              <i className="fas fa-check-circle text-3xl text-tag-healthy shrink-0"></i>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-state-idle mb-2">{t('landing.features.feature1Title')}</h4>
                <p className="text-state-idle/70">{t('landing.features.feature1Description')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <i className="fas fa-check-circle text-3xl text-tag-healthy shrink-0"></i>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-state-idle mb-2">{t('landing.features.feature2Title')}</h4>
                <p className="text-state-idle/70">{t('landing.features.feature2Description')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <i className="fas fa-check-circle text-3xl text-tag-healthy shrink-0"></i>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-state-idle mb-2">{t('landing.features.feature3Title')}</h4>
                <p className="text-state-idle/70">{t('landing.features.feature3Description')}</p>
              </div>
            </div>

            {/* Feature Image */}
            <div ref={imageRef} className="mt-8 rounded-xl overflow-hidden shadow-xl">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8"
                alt="Campo de papas verdes y saludables"
                className="w-full"
                width={600}
                height={400}
                aspectRatio="3/2"
                priority={true}
              />
            </div>
          </div>

          <div ref={statsGridRef} className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center cursor-pointer">
              <i className="fas fa-chart-bar text-4xl text-primary mb-3"></i>
              <p className="text-3xl font-bold mb-1">{t('landing.features.stat1Value')}</p>
              <p className="text-state-idle/70 text-sm">{t('landing.features.stat1Label')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center cursor-pointer">
              <i className="fas fa-shield-alt text-4xl text-primary mb-3"></i>
              <p className="text-3xl font-bold mb-1">{t('landing.features.stat2Value')}</p>
              <p className="text-state-idle/70 text-sm">{t('landing.features.stat2Label')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center cursor-pointer">
              <i className="fas fa-clock text-4xl text-primary mb-3"></i>
              <p className="text-3xl font-bold mb-1">{t('landing.features.stat3Value')}</p>
              <p className="text-state-idle/70 text-sm">{t('landing.features.stat3Label')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center cursor-pointer">
              <i className="fas fa-bolt text-4xl text-primary mb-3"></i>
              <p className="text-3xl font-bold mb-1">{t('landing.features.stat4Value')}</p>
              <p className="text-state-idle/70 text-sm">{t('landing.features.stat4Label')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
