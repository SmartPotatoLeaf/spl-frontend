import I18nProvider from '@/i18n/I18nProvider';
import Header from './Header';

export default function HeaderWrapper() {
  return (
    <I18nProvider>
      <Header />
    </I18nProvider>
  );
}
