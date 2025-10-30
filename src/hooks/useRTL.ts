import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RTL_LANGUAGES = ['ar', 'fa'];

export function useRTL() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isRTL = RTL_LANGUAGES.includes(currentLanguage);

  useEffect(() => {
    const dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLanguage;
  }, [isRTL, currentLanguage]);

  return { isRTL, currentLanguage };
}
