import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

interface ImageCropEditorProps {
  file: File;
  onCropComplete: (croppedFile: File, preview: string) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | null;

export default function ImageCropEditor({ file, onCropComplete, onCancel }: ImageCropEditorProps) {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(0.5);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 224, height: 224 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialCropArea, setInitialCropArea] = useState<CropArea>({ x: 0, y: 0, width: 224, height: 224 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });

      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = 500;
        setContainerSize({ width: containerWidth, height: containerHeight });

        // Calcular escala inicial para que la imagen quepa
        const scaleX = containerWidth / img.width;
        const scaleY = containerHeight / img.height;
        const initialScale = Math.min(scaleX, scaleY, 1);
        setScale(initialScale);

        // Calcular escala mínima (el crop area de 224px debe caber)
        const minScaleForCrop = 224 / Math.min(img.width, img.height);
        setMinScale(Math.max(minScaleForCrop, 0.1));

        // Calcular dimensiones y posición de la imagen escalada
        const displayWidth = img.width * initialScale;
        const displayHeight = img.height * initialScale;

        // CENTRAR la imagen en el contenedor
        const imageX = (containerWidth - displayWidth) / 2;
        const imageY = (containerHeight - displayHeight) / 2;
        setImagePosition({ x: imageX, y: imageY });

        // Área de crop inicial (centrada sobre la imagen)
        const cropSize = 224;
        const cropX = imageX + (displayWidth - cropSize) / 2;
        const cropY = imageY + (displayHeight - cropSize) / 2;

        setCropArea({
          x: cropX,
          y: cropY,
          width: cropSize,
          height: cropSize,
        });
      }
    };
    img.src = url;

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleMouseDown = (e: React.MouseEvent, handle?: ResizeHandle) => {
    e.preventDefault();
    if (handle) {
      // Resizing
      setIsResizing(true);
      setResizeHandle(handle);
      setInitialCropArea({ ...cropArea });
    } else {
      // Dragging
      setIsDragging(true);
    }
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (isResizing && resizeHandle) {
      // Resize del crop area
      let newCrop = { ...initialCropArea };

      const minSize = 50; // Tamaño mínimo del crop
      const maxSize = Math.min(
        imageSize.width * scale,
        imageSize.height * scale
      );

      switch (resizeHandle) {
        case 'tl': // Top-left
          newCrop.x = initialCropArea.x + deltaX;
          newCrop.y = initialCropArea.y + deltaY;
          newCrop.width = initialCropArea.width - deltaX;
          newCrop.height = initialCropArea.height - deltaY;
          break;
        case 'tr': // Top-right
          newCrop.y = initialCropArea.y + deltaY;
          newCrop.width = initialCropArea.width + deltaX;
          newCrop.height = initialCropArea.height - deltaY;
          break;
        case 'bl': // Bottom-left
          newCrop.x = initialCropArea.x + deltaX;
          newCrop.width = initialCropArea.width - deltaX;
          newCrop.height = initialCropArea.height + deltaY;
          break;
        case 'br': // Bottom-right
          newCrop.width = initialCropArea.width + deltaX;
          newCrop.height = initialCropArea.height + deltaY;
          break;
      }

      // Mantener aspecto cuadrado
      const size = Math.min(newCrop.width, newCrop.height);
      
      // Aplicar límites
      const finalSize = Math.max(minSize, Math.min(size, maxSize));

      // Ajustar posición según el handle
      if (resizeHandle === 'tl') {
        newCrop.x = initialCropArea.x + initialCropArea.width - finalSize;
        newCrop.y = initialCropArea.y + initialCropArea.height - finalSize;
      } else if (resizeHandle === 'tr') {
        newCrop.y = initialCropArea.y + initialCropArea.height - finalSize;
      } else if (resizeHandle === 'bl') {
        newCrop.x = initialCropArea.x + initialCropArea.width - finalSize;
      }

      newCrop.width = finalSize;
      newCrop.height = finalSize;

      // Limitar dentro de la imagen
      const imageX = imagePosition.x;
      const imageY = imagePosition.y;
      const imageWidth = imageSize.width * scale;
      const imageHeight = imageSize.height * scale;

      newCrop.x = Math.max(imageX, Math.min(newCrop.x, imageX + imageWidth - finalSize));
      newCrop.y = Math.max(imageY, Math.min(newCrop.y, imageY + imageHeight - finalSize));

      setCropArea(newCrop);

    } else if (isDragging) {
      // Mover el crop area
      let newX = cropArea.x + deltaX;
      let newY = cropArea.y + deltaY;

      const imageX = imagePosition.x;
      const imageY = imagePosition.y;
      const imageWidth = imageSize.width * scale;
      const imageHeight = imageSize.height * scale;

      newX = Math.max(imageX, Math.min(newX, imageX + imageWidth - cropArea.width));
      newY = Math.max(imageY, Math.min(newY, imageY + imageHeight - cropArea.height));

      setCropArea({
        ...cropArea,
        x: newX,
        y: newY,
      });

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleZoom = (newScale: number) => {
    // Limitar el zoom
    const maxScale = 3;
    const boundedScale = Math.max(minScale, Math.min(newScale, maxScale));
    
    // Calcular el centro del crop area actual
    const cropCenterX = cropArea.x + cropArea.width / 2;
    const cropCenterY = cropArea.y + cropArea.height / 2;

    // Calcular la posición relativa del centro en la imagen (0-1)
    const relativeX = (cropCenterX - imagePosition.x) / (imageSize.width * scale);
    const relativeY = (cropCenterY - imagePosition.y) / (imageSize.height * scale);

    // Aplicar nueva escala
    setScale(boundedScale);

    // Recalcular dimensiones de la imagen
    const newDisplayWidth = imageSize.width * boundedScale;
    const newDisplayHeight = imageSize.height * boundedScale;

    // Centrar la imagen en el contenedor
    const newImageX = (containerSize.width - newDisplayWidth) / 2;
    const newImageY = (containerSize.height - newDisplayHeight) / 2;
    setImagePosition({ x: newImageX, y: newImageY });

    // Reposicionar el crop area manteniendo su centro relativo
    const newCropCenterX = newImageX + relativeX * newDisplayWidth;
    const newCropCenterY = newImageY + relativeY * newDisplayHeight;

    let newCropX = newCropCenterX - cropArea.width / 2;
    let newCropY = newCropCenterY - cropArea.height / 2;

    // Asegurar que el crop esté dentro de la imagen
    newCropX = Math.max(newImageX, Math.min(newCropX, newImageX + newDisplayWidth - cropArea.width));
    newCropY = Math.max(newImageY, Math.min(newCropY, newImageY + newDisplayHeight - cropArea.height));

    setCropArea({
      ...cropArea,
      x: newCropX,
      y: newCropY,
    });
  };

  const handleZoomIn = () => {
    handleZoom(scale + 0.1);
  };

  const handleZoomOut = () => {
    handleZoom(scale - 0.1);
  };

  const handleCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calcular coordenadas en la imagen original
      const sourceX = (cropArea.x - imagePosition.x) / scale;
      const sourceY = (cropArea.y - imagePosition.y) / scale;
      const sourceSize = cropArea.width / scale;

      // Dibujar el área recortada
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        224,
        224
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const croppedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, '.jpg'),
            { type: 'image/jpeg' }
          );

          const preview = canvas.toDataURL('image/jpeg', 0.9);
          onCropComplete(croppedFile, preview);
        },
        'image/jpeg',
        0.9
      );
    };
    img.src = imageSrc;
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-xl border border-outline overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-outline">
          <h3 className="text-xl font-bold text-state-idle mb-2">
            {t('upload.crop.title')}
          </h3>
          <p className="text-sm text-state-disabled">
            {t('upload.crop.description')}
          </p>
        </div>

        {/* Editor */}
        <div className="p-6 bg-outline/10">
          <div
            className="relative mx-auto bg-state-disabled/20 rounded-lg overflow-hidden"
            style={{ width: containerSize.width, height: 500 }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Imagen */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="absolute pointer-events-none select-none"
              style={{
                left: `${imagePosition.x}px`,
                top: `${imagePosition.y}px`,
                width: `${imageSize.width * scale}px`,
                height: `${imageSize.height * scale}px`,
              }}
            />

            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />

            {/* Área de crop */}
            <div
              ref={cropBoxRef}
              className="absolute border-2 border-primary bg-transparent cursor-move"
              style={{
                left: `${cropArea.x}px`,
                top: `${cropArea.y}px`,
                width: `${cropArea.width}px`,
                height: `${cropArea.height}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              }}
              onMouseDown={(e) => handleMouseDown(e)}
            >
              {/* Guías de regla de tercios */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>

              {/* Esquinas para resize - CLICKEABLES */}
              <div
                className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize z-10 border-2 border-white"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'tl');
                }}
              />
              <div
                className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize z-10 border-2 border-white"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'tr');
                }}
              />
              <div
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize z-10 border-2 border-white"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'bl');
                }}
              />
              <div
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize z-10 border-2 border-white"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'br');
                }}
              />
            </div>

            {/* Info del crop */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg">
              <p className="font-bold mb-1">{t('upload.crop.cropArea')}</p>
              <p>{Math.round(cropArea.width)} × {Math.round(cropArea.height)} px</p>
              <p className="text-white/70 mt-1">→ 224 × 224 px</p>
            </div>
          </div>

          {/* Controles de zoom */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 flex items-center justify-center bg-white border border-outline rounded-lg hover:border-primary hover:text-primary transition-colors"
              title={t('upload.crop.zoomOut')}
            >
              <i className="fas fa-minus"></i>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-outline rounded-lg">
              <i className="fas fa-search text-state-disabled"></i>
              <span className="text-sm font-bold text-state-idle min-w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
            </div>

            <button
              onClick={handleZoomIn}
              className="w-10 h-10 flex items-center justify-center bg-white border border-outline rounded-lg hover:border-primary hover:text-primary transition-colors"
              title={t('upload.crop.zoomIn')}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

          {/* Instrucciones */}
          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-primary mt-0.5"></i>
              <div className="flex-1 text-sm text-state-idle">
                <p className="font-bold mb-1">{t('upload.crop.instructions.title')}</p>
                <ul className="list-disc list-inside space-y-1 text-state-disabled">
                  <li>{t('upload.crop.instructions.drag')}</li>
                  <li>{t('upload.crop.instructions.zoom')}</li>
                  <li>{t('upload.crop.instructions.center')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-6 border-t border-outline flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCrop}
            className="
              flex-1 px-6 py-3.5 bg-primary text-white rounded-lg
              font-bold transition-all duration-300
              hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]
              active:scale-[0.98]
              flex items-center justify-center gap-2
            "
          >
            <i className="fas fa-check"></i>
            {t('upload.crop.apply')}
          </button>

          <button
            onClick={onCancel}
            className="
              px-6 py-3.5 bg-white border-2 border-outline text-state-idle
              rounded-lg font-medium transition-all duration-300
              hover:border-error hover:text-error hover:bg-error/5
              flex items-center justify-center gap-2
            "
          >
            <i className="fas fa-times"></i>
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
