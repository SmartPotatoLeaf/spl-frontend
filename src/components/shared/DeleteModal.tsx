import {useState} from 'react';
import {useTranslation} from 'react-i18next';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  successMessage?: string;
  errorMessage?: string;
}

export default function DeleteModal({
                                      isOpen,
                                      onClose,
                                      onConfirm,
                                      title,
                                      description,
                                      confirmText,
                                    }: DeleteModalProps) {
  const {t} = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-state-idle/50 backdrop-blur-sm" onClick={() => !isDeleting && onClose()}/>

      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-medium text-state-idle">
                {title}
              </h2>
              <p className="text-state-disabled mt-1">{description}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-outline text-state-idle rounded-lg hover:bg-outline/10 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
            >
              {isDeleting ? t('common.loading') : (confirmText || t('common.delete'))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

