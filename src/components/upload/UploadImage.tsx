import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import gsap from 'gsap';
import type {ImageUploadState} from '@/types/upload';
import UploadZone from './UploadZone';
import ImagePreview from './ImagePreview';
import ProcessingLoader from './ProcessingLoader';
import ImageCropEditor from './ImageCropEditor';
import {createPrediction} from "@/services/diagnosticsService.ts";

export default function UploadImage() {
  const { t } = useTranslation();
  const [uploadState, setUploadState] = useState<ImageUploadState>({
    status: 'idle',
    progress: 0,
    error: null,
    processedImage: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropEditor, setShowCropEditor] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    // Guardar el archivo y mostrar el editor de crop
    setSelectedFile(file);
    setShowCropEditor(true);
  };

  const handleCropComplete = async (croppedFile: File, preview: string) => {
    setShowCropEditor(false);
    setUploadState({
      status: 'processing',
      progress: 75,
      error: null,
      processedImage: null,
    });

    try {
      // El archivo ya viene procesado del crop editor (224x224)
      const processedImage = {
        file: croppedFile,
        preview,
        width: 256,
        height: 256,
        size: croppedFile.size,
      };

      setUploadState({
        status: 'success',
        progress: 100,
        error: null,
        processedImage,
      });
    } catch (error) {
      setUploadState({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : t('upload.errors.processingError'),
        processedImage: null,
      });
    }
  };

  const handleCropCancel = () => {
    setShowCropEditor(false);
    setSelectedFile(null);
  };

  const handleAnalyze = async () => {
    if (!uploadState.processedImage) return;

    setUploadState((prev) => ({ ...prev, status: 'uploading', progress: null! }));

    try {
      const data = new FormData();
      data.set("request", uploadState.processedImage.file)
      const response = await createPrediction(data);
      window.location.href = "/diagnostics/" + response.id;
      // const predictionId = '1';
      // window.location.href = `/diagnostics/${predictionId}`;
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        status: 'error',
        error: t('upload.errors.analyzeError'),
      }));
    }
  };

  const handleReset = () => {
    setUploadState({
      status: 'idle',
      progress: 0,
      error: null,
      processedImage: null,
    });
    setSelectedFile(null);
    setShowCropEditor(false);
  };

  return (
    <div ref={containerRef} className="space-y-6 sm:space-y-8">
      {/* Header con guía fotográfica */}
      <div
        className="relative bg-cover bg-center rounded-xl overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000')`,
        }}
      >
        <div className="px-6 py-8 sm:px-12 sm:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            {t('upload.guide.title')}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-camera text-2xl sm:text-3xl"></i>
              </div>
              <h3 className="font-bold mb-2 text-base sm:text-lg">
                {t('upload.guide.closeUp.title')}
              </h3>
              <p className="text-sm text-white/90">
                {t('upload.guide.closeUp.description')}
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-sun text-2xl sm:text-3xl"></i>
              </div>
              <h3 className="font-bold mb-2 text-base sm:text-lg">
                {t('upload.guide.goodLight.title')}
              </h3>
              <p className="text-sm text-white/90">
                {t('upload.guide.goodLight.description')}
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-leaf text-2xl sm:text-3xl"></i>
              </div>
              <h3 className="font-bold mb-2 text-base sm:text-lg">
                {t('upload.guide.isolated.title')}
              </h3>
              <p className="text-sm text-white/90">
                {t('upload.guide.isolated.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Título de sección */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-state-idle mb-2">
          {t('upload.section.title')}
        </h2>
        <p className="text-sm sm:text-base text-state-disabled max-w-2xl mx-auto px-4">
          {t('upload.section.description')}
        </p>
      </div>

      {/* Zona de upload o preview */}
      {showCropEditor && selectedFile ? (
        <ImageCropEditor
          file={selectedFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      ) : uploadState.status === 'idle' ||
        uploadState.status === 'validating' ||
        uploadState.status === 'error' ? (
        <UploadZone
          onFileSelect={handleFileSelect}
          error={uploadState.error}
          isValidating={uploadState.status === 'validating'}
        />
      ) : uploadState.status === 'processing' || uploadState.status === 'uploading' ? (
        <ProcessingLoader status={uploadState.status} progress={uploadState.progress} />
      ) : uploadState.processedImage ? (
        <ImagePreview
          image={uploadState.processedImage}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
        />
      ) : null}
    </div>
  );
}
