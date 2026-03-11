'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { When } from 'react-if';
import { useSearchSuggestions } from '@/lib/hooks/useProducts';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { s } from './SearchInput.styled';


export const SearchInput = () => {
  const { get, update } = useProductParams();
  const [query, setQuery] = useState(get('search') ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleSelectSuggestion = useCallback(() => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setIsOpen(false);
  }, []);

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
          placeholder="Поиск товаров..."
          className={s.input}
        />
        <When condition={showDropdown}>
          <div className={s.dropdown}>
            {suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={s.item}
                onClick={handleSelectSuggestion}
              >
                {product.name}
              </Link>
            ))}
          </div>
        </When>
      </div>
    </form>
  );
};
