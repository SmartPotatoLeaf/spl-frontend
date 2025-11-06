import { useEffect, useRef, useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  aspectRatio?: string;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width = 800, 
  height = 600,
  priority = false,
  aspectRatio = '4/3'
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const optimizedSrc = src.includes('unsplash.com') 
    ? `${src}?w=${width}&h=${height}&fit=crop&auto=format&q=80`
    : src;

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      ref={imgRef}
      style={{ aspectRatio }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200">
          <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin"
              style={{ borderTopColor: 'var(--color-primary)' }}
            ></div>
          </div>
        </div>
      )}
      
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
