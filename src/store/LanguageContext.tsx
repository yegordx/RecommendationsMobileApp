import React, { createContext, useContext, useState } from 'react';
import { Language, Translations, translations } from '../constants/translations';

type LanguageContextType = {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ua',
  t: translations.ua,
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ua');

  function toggleLanguage() {
    setLanguage((prev) => (prev === 'ua' ? 'en' : 'ua'));
  }

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
