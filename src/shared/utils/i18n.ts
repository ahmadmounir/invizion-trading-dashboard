import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../../locales/en/common.json';
import enAuth from '../../locales/en/auth.json';
import enSettings from '../../locales/en/settings.json';

import trCommon from '../../locales/tr/common.json';
import trAuth from '../../locales/tr/auth.json';
import trSettings from '../../locales/tr/settings.json';

import arCommon from '../../locales/ar/common.json';
import arAuth from '../../locales/ar/auth.json';
import arSettings from '../../locales/ar/settings.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    settings: enSettings,
  },
  tr: {
    common: trCommon,
    auth: trAuth,
    settings: trSettings,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    settings: arSettings,
  },
};

const SUPPORTED_LANGUAGES = ['tr', 'en', 'ar'] as const;
const RTL_LANGUAGES = ['ar'];
const LANGUAGE_STORAGE_KEY = 'inviziontenantui-language';

// Defaults to Turkish, but the user can change it any time via
// <LanguageSwitcher /> (auth header, main app header, Settings > Preferences).
// This only reads localStorage, which LanguageSwitcher keeps in sync.
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(stored ?? '')
    ? (stored as string)
    : 'tr';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    ns: ['common', 'auth', 'email', 'settings', 'help', 'services'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;

export const getLanguageDirection = (): 'ltr' | 'rtl' =>
  RTL_LANGUAGES.includes(i18n.language) ? 'rtl' : 'ltr';

export const setDocumentDirection = () => {
  const direction = getLanguageDirection();
  document.documentElement.dir = direction;
  document.documentElement.lang = i18n.language;
  document.documentElement.classList.toggle('rtl', direction === 'rtl');
};

// Persist every language change so it survives a reload — changeLanguage()
// only updates the in-memory instance, it doesn't touch localStorage itself.
const persistLanguage = (lng: string) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
};

setDocumentDirection();
i18n.on('languageChanged', setDocumentDirection);
i18n.on('languageChanged', persistLanguage);
