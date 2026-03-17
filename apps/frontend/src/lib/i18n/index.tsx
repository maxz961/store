'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
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


// ─── External lang store (pub-sub over localStorage) ────────────────────────

const langListeners = new Set<() => void>();

function getLangSnapshot(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return stored === 'en' || stored === 'uk' ? stored : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

function subscribeLang(callback: () => void): () => void {
  langListeners.add(callback);
  return () => { langListeners.delete(callback); };
}

function setStoredLang(next: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch { /* ignore */ }
  langListeners.forEach((cb) => cb());
}

// Server snapshot — always DEFAULT_LANG so server HTML matches the initial client render.
// After hydration, useSyncExternalStore automatically switches to getLangSnapshot().
const getServerLangSnapshot = (): Lang => DEFAULT_LANG;


// ─── Context ─────────────────────────────────────────────────────────────────

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
  // useSyncExternalStore guarantees:
  //   - Server render + client hydration → getServerLangSnapshot() = DEFAULT_LANG → no mismatch
  //   - After hydration → getLangSnapshot() reads localStorage → re-render to stored lang
  //   - React Fast Refresh safe: no useState, reads directly from the store each render
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getServerLangSnapshot);

  const setLang = useCallback((next: Lang) => {
    setStoredLang(next);
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
