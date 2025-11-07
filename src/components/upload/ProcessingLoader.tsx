import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import type { UploadStatus } from '@/types/upload';

interface ProcessingLoaderProps {
  status: UploadStatus;
  progress: number;
}

export default function ProcessingLoader({ status, progress }: ProcessingLoaderProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animación de entrada
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }

    // Animación de círculo pulsante
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    // Animación de puntos suspensivos
    if (dotsRef.current) {
      const dots = dotsRef.current.children;
      gsap.to(dots, {
        opacity: 0.3,
        duration: 0.4,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, []);

  const getMessage = () => {
    switch (status) {
      case 'processing':
        return t('upload.processing.optimizing');
      case 'uploading':
        return t('upload.processing.analyzing');
      default:
        return t('upload.processing.loading');
    }
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-xl border border-outline p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          {/* Círculo animado */}
          <div className="relative mb-8">
            <div
              ref={circleRef}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <i className="fas fa-leaf text-4xl sm:text-5xl text-primary"></i>
            </div>

            {/* Spinner alrededor */}
            <div className="absolute inset-0">
              <svg className="w-full h-full animate-spin" viewBox="0 0 50 50">
                <circle
                  className="stroke-primary/30"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="3"
                />
                <circle
                  className="stroke-primary"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray="80"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Mensaje */}
          <h3 className="text-xl sm:text-2xl font-bold text-state-idle mb-2">
            {getMessage()}
            <span ref={dotsRef} className="inline-flex ml-1">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </h3>

          <p className="text-sm sm:text-base text-state-disabled mb-6">
            {status === 'processing'
              ? t('upload.processing.resizing')
              : t('upload.processing.wait')}
          </p>

          {/* Barra de progreso */}
          <div className="w-full bg-outline/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs sm:text-sm text-state-disabled mt-3">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
