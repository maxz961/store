'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { s } from './page.styled';


export const ProductSearch = ({ defaultValue, sortBy, sortOrder }: {
  defaultValue?: string;
  sortBy: string;
  sortOrder: string;
}) => {
  const [value, setValue] = useState(defaultValue ?? '');
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams({ page: '1', sortBy, sortOrder });
      if (value.trim()) params.set('search', value.trim());
      router.push(`/admin/products?${params.toString()}`);
    },
    [value, sortBy, sortOrder, router],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={s.searchForm}>
      <div className={s.searchWrapper}>
        <Search className={s.searchIcon} />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Поиск товаров..."
          className={s.searchInput}
        />
      </div>
    </form>
  );
};
