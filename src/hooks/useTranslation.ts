import { translations } from '../i18n/translations';
import { useStore } from '../store/store';

export function useTranslation() {
  const language = useStore(state => state.language);
  const t = translations[language];
  return { t, language };
}
