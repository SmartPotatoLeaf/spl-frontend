import {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import gsap from 'gsap';
import type {ProcessedImage} from '@/types/upload';
import {formatFileSize} from '@/utils/imageProcessor';

interface ImagePreviewProps {
  image: ProcessedImage;
  onAnalyze: () => void;
  onReset: () => void;
}

export default function ImagePreview({ image, onAnalyze, onReset }: ImagePreviewProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Animación de entrada del contenedor
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }

    // Animación de la imagen con efecto de revelado
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      );
    }
  }, []);

  const handleAnalyzeClick = () => {
    // Animación de salida antes de analizar
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 0.95,
        opacity: 0.5,
        duration: 0.3,
        onComplete: onAnalyze,
      });
    }
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-xl border border-outline overflow-hidden">
        {/* Preview de la imagen */}
        <div className="relative bg-linear-to-br from-primary/5 to-primary/10 p-8 sm:p-12">
          <div className="flex justify-center">
            <div className="relative">
              <img
                ref={imageRef}
                src={image.preview}
                alt="Preview"
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />

              {/* Badge de dimensiones */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                {image.width} × {image.height}
              </div>
            </div>
          </div>
        </div>

        {/* Info y acciones */}
        <div className="p-6 sm:p-8">
          {/* Info de la imagen */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <i className="fas fa-check-circle text-primary text-xl mb-2"></i>
              <p className="text-xs text-state-disabled mb-1">{t('upload.preview.status')}</p>
              <p className="text-sm font-bold text-state-idle">{t('upload.preview.ready')}</p>
            </div>

            <div className="text-center p-3 bg-outline/30 rounded-lg">
              <i className="fas fa-expand text-state-disabled text-xl mb-2"></i>
              <p className="text-xs text-state-disabled mb-1">{t('upload.preview.size')}</p>
              <p className="text-sm font-bold text-state-idle">
                {image.width}×{image.height}
              </p>
            </div>

            <div className="text-center p-3 bg-outline/30 rounded-lg">
              <i className="fas fa-file text-state-disabled text-xl mb-2"></i>
              <p className="text-xs text-state-disabled mb-1">{t('upload.preview.fileSize')}</p>
              <p className="text-sm font-bold text-state-idle">{formatFileSize(image.size)}</p>
            </div>

            <div className="text-center p-3 bg-outline/30 rounded-lg">
              <i className="fas fa-image text-state-disabled text-xl mb-2"></i>
              <p className="text-xs text-state-disabled mb-1">{t('upload.preview.format')}</p>
              <p className="text-sm font-bold text-state-idle">JPEG</p>
            </div>
          </div>

          {/* Mensaje de optimización */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-primary mt-0.5"></i>
              <div className="flex-1">
                <p className="text-sm text-state-idle">
                  <span className="font-bold">{t('upload.preview.optimized')}</span>
                  {' '}
                  {t('upload.preview.optimizedDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAnalyzeClick}
              className="
                flex-1 px-6 py-3.5 bg-primary text-white rounded-lg
                font-bold transition-all duration-300
                hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]
                active:scale-[0.98]
                flex items-center justify-center gap-2
              "
            >
              <i className="fas fa-microscope"></i>
              {t('upload.preview.analyze')}
            </button>

            <button
              onClick={onReset}
              className="
                px-6 py-3.5 bg-white border-2 border-outline text-state-idle
                rounded-lg font-medium transition-all duration-300
                hover:border-primary hover:text-primary hover:bg-primary/5
                flex items-center justify-center gap-2
              "
            >
              <i className="fas fa-redo"></i>
              {t('upload.preview.uploadAnother')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
