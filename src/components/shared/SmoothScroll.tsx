import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';

export default function SmoothScroll() {
  useEffect(() => {
    // Registrar plugin
    gsap.registerPlugin(ScrollToPlugin);

    // Smooth scroll para todos los enlaces ancla
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;

      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');

        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            gsap.to(window, {
              duration: 1,
              scrollTo: {
                y: targetElement,
                offsetY: 80 // Offset para el header
              },
              ease: 'power3.inOut'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return null;
}
