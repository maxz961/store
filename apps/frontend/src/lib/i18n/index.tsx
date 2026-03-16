'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { en } from './en';
import { uk } from './uk';
import type { Translations } from './en';


export type Lang = 'en' | 'uk';

const STORAGE_KEY = 'lang';
const DEFAULT_LANG: Lang = 'en';

const translations: Record<Lang, Translations> = { en, uk };

type Path<T, Prefix extends string = ''> = T extends string
  ? Prefix
  : T extends object
  ? {
      [K in keyof T]: Path<T[K], Prefix extends '' ? `${string & K}` : `${Prefix}.${string & K}`>;
    }[keyof T]
  : never;

type TranslationKey = Path<Translations>;

function getByPath(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : path;
}


interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);


interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'en' || stored === 'uk') {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = translations[lang] as unknown as Record<string, unknown>;
      const result = getByPath(dict, key);
      if (result === key) {
        return getByPath(translations[DEFAULT_LANG] as unknown as Record<string, unknown>, key);
      }
      return result;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
};
