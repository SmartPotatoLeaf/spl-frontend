import type { UploadConfig, ImageValidationResult, ProcessedImage } from '@/types/upload';
import i18next from 'i18next';

export const UPLOAD_CONFIG: UploadConfig = {
  maxSizeMB: 10, // Máximo 10MB
  minWidth: 224, // Mínimo para web (ResNet50 usa 224x224)
  minHeight: 224,
  targetWidth: 224, // Tamaño objetivo para ResNet50
  targetHeight: 224,
  quality: 0.9, // Calidad de compresión JPEG
  acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
};

/**
 * Valida que el archivo sea una imagen válida
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { 
      isValid: false, 
      error: i18next.t('upload.errors.noFile') 
    };
  }

  if (!UPLOAD_CONFIG.acceptedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: i18next.t('upload.errors.invalidFormat'),
    };
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > UPLOAD_CONFIG.maxSizeMB) {
    return {
      isValid: false,
      error: i18next.t('upload.errors.fileTooLarge', { max: UPLOAD_CONFIG.maxSizeMB }),
    };
  }

  return { isValid: true, file };
}

/**
 * Valida las dimensiones de la imagen (solo para web)
 */
export async function validateImageDimensions(file: File): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (
        img.width < UPLOAD_CONFIG.minWidth ||
        img.height < UPLOAD_CONFIG.minHeight
      ) {
        resolve({
          isValid: false,
          error: i18next.t('upload.errors.imageTooSmall', { 
            minWidth: UPLOAD_CONFIG.minWidth, 
            minHeight: UPLOAD_CONFIG.minHeight 
          }),
        });
      } else {
        resolve({ isValid: true, file });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: i18next.t('upload.errors.cannotReadImage'),
      });
    };

    img.src = url;
  });
}

/**
 * Redimensiona y optimiza la imagen para ResNet50
 */
export async function processImageForModel(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Crear canvas con dimensiones objetivo
      const canvas = document.createElement('canvas');
      canvas.width = UPLOAD_CONFIG.targetWidth;
      canvas.height = UPLOAD_CONFIG.targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error(i18next.t('upload.errors.canvasError')));
        return;
      }

      const aspectRatio = img.width / img.height;
      const targetAspectRatio = UPLOAD_CONFIG.targetWidth / UPLOAD_CONFIG.targetHeight;

      let sourceWidth = img.width;
      let sourceHeight = img.height;
      let sourceX = 0;
      let sourceY = 0;

      if (aspectRatio > targetAspectRatio) {
        sourceWidth = img.height * targetAspectRatio;
        sourceX = (img.width - sourceWidth) / 2;
      } else {
        sourceHeight = img.width / targetAspectRatio;
        sourceY = (img.height - sourceHeight) / 2;
      }

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        UPLOAD_CONFIG.targetWidth,
        UPLOAD_CONFIG.targetHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error(i18next.t('upload.errors.processingError')));
            return;
          }

          const processedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, '.jpg'),
            { type: 'image/jpeg' }
          );

          const preview = canvas.toDataURL('image/jpeg', UPLOAD_CONFIG.quality);

          resolve({
            file: processedFile,
            preview,
            width: UPLOAD_CONFIG.targetWidth,
            height: UPLOAD_CONFIG.targetHeight,
            size: blob.size,
          });
        },
        'image/jpeg',
        UPLOAD_CONFIG.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(i18next.t('upload.errors.loadImageError')));
    };

    img.src = url;
  });
}

/**
 * Formatea el tamaño del archivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
