import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  error: string | null;
  isValidating: boolean;
}

export default function UploadZone({ onFileSelect, error, isValidating }: UploadZoneProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 sm:p-12 lg:p-16
          transition-all duration-300 cursor-pointer
          ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : error
              ? 'border-error bg-error/5'
              : 'border-outline hover:border-primary hover:bg-primary/5'
          }
          ${isValidating ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInput}
          className="hidden"
          disabled={isValidating}
        />

        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className={`
            w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6
            transition-colors duration-300
            ${
              isDragging
                ? 'bg-primary text-white'
                : error
                ? 'bg-error/10 text-error'
                : 'bg-primary/10 text-primary'
            }
          `}
          >
            {isValidating ? (
              <i className="fas fa-spinner fa-spin text-3xl sm:text-4xl"></i>
            ) : (
              <i className="fas fa-cloud-upload-alt text-3xl sm:text-4xl"></i>
            )}
          </div>

          {/* Text */}
          <p className="text-lg sm:text-xl font-bold text-state-idle mb-2">
            {isValidating
              ? t('upload.zone.validating')
              : isDragging
              ? t('upload.zone.dropHere')
              : t('upload.zone.dragDrop')}
          </p>

          <p className="text-sm sm:text-base text-state-disabled mb-6">
            {t('upload.zone.orClick')}
          </p>

          <button
            type="button"
            disabled={isValidating}
            className="
              px-6 py-3 bg-white border-2 border-primary text-primary
              rounded-lg font-medium transition-all duration-300
              hover:bg-primary hover:text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm sm:text-base
            "
          >
            {t('upload.zone.browse')}
          </button>

          {/* Format info */}
          <p className="text-xs sm:text-sm text-state-disabled mt-6">
            {t('upload.zone.formats')}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-error/10 border border-error rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-exclamation-circle text-error mt-0.5"></i>
              <p className="text-sm text-error flex-1">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
