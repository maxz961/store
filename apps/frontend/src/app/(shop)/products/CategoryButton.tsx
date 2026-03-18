'use client';

import { cn, getLocalizedText } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { s } from './ProductFilters.styled';
import type { CategoryButtonProps } from './ProductFilters.types';


export const CategoryButton = ({ category, isActive, onClick }: CategoryButtonProps) => {
  const { lang } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(s.categoryItem, isActive ? s.categoryActive : s.categoryInactive)}
    >
      {getLocalizedText(lang, category.name, category.nameEn)}
    </button>
  );
};
