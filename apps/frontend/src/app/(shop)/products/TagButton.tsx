'use client';

import { getLocalizedText } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import { s } from './ProductFilters.styled';
import type { TagButtonProps } from './ProductFilters.types';


export const TagButton = ({ tag, isActive, onClick }: TagButtonProps) => {
  const { lang } = useLanguage();

  return (
    <button type="button" onClick={onClick}>
      <Badge
        variant={isActive ? 'default' : 'outline'}
        className={s.tagBadge}
      >
        {getLocalizedText(lang, tag.name, tag.nameEn)}
      </Badge>
    </button>
  );
};
