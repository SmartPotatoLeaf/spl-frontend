import {useEffect, useState} from 'react';
import {I18nextProvider} from 'react-i18next';
import i18n from './config';

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Asegurarse de que i18n esté inicializado antes de renderizar
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => {
        setIsReady(true);
      });
    }
  }, []);

  if (!isReady) {
    return null; // Esperar a que i18n se inicialice
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
