'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { If, Then, Else, When } from 'react-if';
import { cn } from '@/lib/utils';
import { useAdminProductSuggestions } from '@/lib/hooks/useAdmin';
import { s } from './page.styled';


export const ProductSearch = ({ defaultValue, sortBy, sortOrder }: {
  defaultValue?: string;
  sortBy: string;
  sortOrder: string;
}) => {
  const [value, setValue] = useState(defaultValue ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data } = useAdminProductSuggestions(value);
  const suggestions = useMemo(() => data?.items ?? [], [data]);
  const showDropdown = isOpen && value.trim().length >= 2 && suggestions.length > 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsOpen(false);
      const params = new URLSearchParams({ page: '1', sortBy, sortOrder });
      if (value.trim()) params.set('search', value.trim());
      router.push(`/admin/products?${params.toString()}`);
    },
    [value, sortBy, sortOrder, router],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  }, []);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        setIsOpen(false);
        router.push(`/admin/products/${suggestions[activeIndex].slug}`);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [showDropdown, suggestions, activeIndex, router],
  );

  const handleSelectSuggestion = useCallback(
    (slug: string) => () => {
      setIsOpen(false);
      router.push(`/admin/products/${slug}`);
    },
    [router],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={s.searchForm}>
      <form onSubmit={handleSubmit}>
        <div className={s.searchWrapper}>
          <Search className={s.searchIcon} />
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Поиск товаров..."
            className={s.searchInput}
            autoComplete="off"
          />
        </div>
      </form>

      <When condition={showDropdown}>
        <div className={s.suggestionsDropdown}>
          {suggestions.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onMouseDown={handleSelectSuggestion(product.slug)}
              className={cn(s.suggestionItem, index === activeIndex && s.suggestionItemActive)}
            >
              <If condition={product.images.length > 0}>
                <Then>
                  <Image
                    src={product.images[0]}
                    alt=""
                    width={32}
                    height={32}
                    className={s.suggestionImage}
                    unoptimized
                  />
                </Then>
                <Else>
                  <div className={s.suggestionImageFallback}>—</div>
                </Else>
              </If>
              <span className={s.suggestionName}>{product.name}</span>
              <span className={s.suggestionMeta}>
                <When condition={!product.isPublished}>
                  <span className={s.suggestionDraftBadge}>Черновик</span>
                </When>
                <When condition={!!product.category}>
                  <span className={s.suggestionCategory}>{product.category?.name}</span>
                </When>
              </span>
            </button>
          ))}
        </div>
      </When>
    </div>
  );
};
