'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useLanguage } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';


const LANG_OPTIONS: { value: Lang; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'uk', label: 'Українська', flag: '🇺🇦' },
];

const LANG_TRIGGER_LABEL: Record<Lang, string> = {
  en: 'EN',
  uk: 'UK',
};


export const LangSwitcher = () => {
  const { lang, setLang } = useLanguage();

  const handleSelect = useCallback(
    (value: Lang) => () => setLang(value),
    [setLang],
  );

  const trigger = (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 min-w-[40px] px-2 text-xs font-medium"
      aria-label="Change language"
      suppressHydrationWarning
    >
      {LANG_TRIGGER_LABEL[lang]}
    </Button>
  );

  const menu = (
    <div className="py-1 min-w-[140px]">
      {LANG_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={handleSelect(option.value)}
          className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors duration-150 hover:bg-accent ${lang === option.value ? 'font-medium text-primary' : 'text-foreground'}`}
        >
          <span>{option.flag}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <Dropdown trigger={trigger}>
      {menu}
    </Dropdown>
  );
};
