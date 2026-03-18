'use client';

import { useState, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import { When } from 'react-if';
import { useSearchSuggestions } from '@/lib/hooks/useProducts';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { useLanguage } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import { s } from './SearchInput.styled';


export const SearchInput = () => {
  const { get, update } = useProductParams();
  const [query, setQuery] = useState(get('search') ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t, lang } = useLanguage();

  const { data } = useSearchSuggestions(query);
  const suggestions = data?.items ?? [];
  const showDropdown = isOpen && query.trim().length >= 2 && suggestions.length > 0;

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsOpen(false);
      update({ search: query.trim() || undefined });
    },
    [query, update],
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  }, []);

  const handleFocus = useCallback(() => setIsOpen(true), []);

  const handleBlur = useCallback(() => {
    blurTimer.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  const handleSelectSuggestion = useCallback(
    (name: string) => () => {
      if (blurTimer.current) clearTimeout(blurTimer.current);
      setQuery(name);
      setIsOpen(false);
      update({ search: name });
    },
    [update],
  );

  return (
    <form onSubmit={handleSearch} className={s.form}>
      <div className={s.wrapper}>
        <Search className={s.icon} />
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={t('catalog.search')}
          className={s.input}
        />
        <When condition={showDropdown}>
          <div className={s.dropdown}>
            {suggestions.map((product) => {
              const localizedName = getLocalizedText(lang, product.name, product.nameEn);
              return (
                <button
                  key={product.id}
                  type="button"
                  className={s.item}
                  onClick={handleSelectSuggestion(localizedName)}
                >
                  {localizedName}
                </button>
              );
            })}
          </div>
        </When>
      </div>
    </form>
  );
};
