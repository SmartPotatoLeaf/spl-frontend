import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { toastsStore, removeToast } from '@/stores';
import type { Toast } from '@/stores/toastStore';

export default function Toaster() {
  const toasts = useStore(toastsStore);

  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animar salida 300ms antes de remover
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, (toast.duration || 3000) - 300);

    return () => clearTimeout(exitTimer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <i className="fas fa-check-circle text-xl text-primary"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle text-xl text-error"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle text-xl text-tag-mid"></i>;
      case 'info':
        return <i className="fas fa-info-circle text-xl text-primary"></i>;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-white border-l-4 border-l-primary';
      case 'error':
        return 'bg-white border-l-4 border-l-error';
      case 'warning':
        return 'bg-white border-l-4 border-l-tag-mid';
      case 'info':
        return 'bg-white border-l-4 border-l-primary';
    }
  };

  return (
    <div
      className={`
        ${getBgColor()}
        rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px]
        pointer-events-auto
        transition-all duration-300 ease-in-out
        ${isExiting 
          ? 'opacity-0 translate-x-full' 
          : 'opacity-100 translate-x-0'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-state-idle">
            {toast.message}
          </p>
          {toast.description && (
            <p className="text-xs text-state-disabled mt-1">
              {toast.description}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          className="shrink-0 text-state-disabled hover:text-state-idle transition-colors"
          aria-label="Cerrar"
        >
          <i className="fas fa-times text-sm"></i>
        </button>
      </div>
    </div>
  );
}
