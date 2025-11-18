import {useEffect} from 'react';
import gsap from 'gsap';

export default function MicroInteractions() {
  useEffect(() => {
    const icons = document.querySelectorAll('.fa, .fas, .fab, .far, .fal');

    icons.forEach((icon) => {
      const iconElement = icon as HTMLElement;

      iconElement.addEventListener('mouseenter', () => {
        gsap.to(iconElement, {
          scale: 1.15,
          rotation: 5,
          duration: 0.3,
          ease: 'back.out(2)'
        });
      });

      iconElement.addEventListener('mouseleave', () => {
        gsap.to(iconElement, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'back.out(1)'
        });
      });
    });
  }, []);

  return null;
}
