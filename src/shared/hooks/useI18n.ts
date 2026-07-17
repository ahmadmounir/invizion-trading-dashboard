import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  return {
    t,
    i18n,
    language: i18n.language,
    isRTL: i18n.language?.startsWith('ar') ?? false,
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
  };
};
