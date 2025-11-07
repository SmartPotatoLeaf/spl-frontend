export interface UploadConfig {
  maxSizeMB: number;
  minWidth: number;
  minHeight: number;
  targetWidth: number;
  targetHeight: number;
  quality: number;
  acceptedFormats: string[];
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

export interface ProcessedImage {
  file: File;
  preview: string;
  width: number;
  height: number;
  size: number;
}

export type UploadStatus = 'idle' | 'validating' | 'processing' | 'uploading' | 'success' | 'error';

export interface ImageUploadState {
  status: UploadStatus;
  progress: number;
  error: string | null;
  processedImage: ProcessedImage | null;
}
