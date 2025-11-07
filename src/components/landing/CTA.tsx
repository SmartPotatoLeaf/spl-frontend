import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AppStore from '../layout/AppStore';
import GooglePlay from '../layout/GooglePlay';

export default function CTA() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    if (subtitleRef.current) {
      gsap.from(subtitleRef.current, {
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      });
    }

    const buttons = buttonsRef.current?.children;
    if (buttons && buttons.length > 0) {
      gsap.from(buttons, {
        scrollTrigger: {
          trigger: buttonsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }

    if (noteRef.current) {
      gsap.from(noteRef.current, {
        scrollTrigger: {
          trigger: noteRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power2.out'
      });
    }

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-12">
        <h2 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl font-bold text-state-idle">
          {t('landing.cta.title')}
        </h2>
        <p ref={subtitleRef} className="text-lg sm:text-xl text-state-idle/70 leading-relaxed">
          {t('landing.cta.subtitle')}
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#"
            className="transition-transform hover:scale-105 w-44 sm:w-48"
            aria-label="Descargar en Google Play"
          >
            <GooglePlay className="w-full h-auto" />
          </a>
          <a
            href="#"
            className="transition-transform hover:scale-105 w-44 sm:w-48"
            aria-label="Descargar en App Store"
          >
            <AppStore className="w-full h-auto" />
          </a>
        </div>

        <p ref={noteRef} className="text-sm sm:text-base text-state-idle/70">
          {t('landing.cta.note')}
        </p>
      </div>
    </section>
  );
}
