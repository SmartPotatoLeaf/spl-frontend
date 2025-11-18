import {atom} from 'nanostores';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

export const toastsStore = atom<Toast[]>([]);

let toastId = 0;

export function showToast(
  type: ToastType,
  message: string,
  description?: string,
  duration: number = 3000
) {
  const id = `toast-${++toastId}`;
  const toast: Toast = { id, type, message, description, duration };

  toastsStore.set([...toastsStore.get(), toast]);

  // Auto-remove después del duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

export function removeToast(id: string) {
  toastsStore.set(toastsStore.get().filter((toast) => toast.id !== id));
}

// Helpers para tipos específicos
export const toast = {
  success: (message: string, description?: string, duration?: number) =>
    showToast('success', message, description, duration),

  error: (message: string, description?: string, duration?: number) =>
    showToast('error', message, description, duration),

  info: (message: string, description?: string, duration?: number) =>
    showToast('info', message, description, duration),

  warning: (message: string, description?: string, duration?: number) =>
    showToast('warning', message, description, duration),
};
