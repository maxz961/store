'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { ProductsViewSwitchProps } from './page.types';


export const ProductsViewSwitch = ({ currentView, imageErrorCount }: ProductsViewSwitchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const handleSelectAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('view');
    params.set('page', '1');
    router.push(`/admin/products?${params.toString()}`);
  }, [router, searchParams]);

  const handleSelectBroken = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', 'broken');
    params.set('page', '1');
    router.push(`/admin/products?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className={s.viewSwitch}>
      <button
        onClick={handleSelectAll}
        className={cn(s.viewTab, currentView === 'all' && s.viewTabActive)}
      >
        {t('admin.products.viewAll')}
      </button>
      <button
        onClick={handleSelectBroken}
        className={cn(s.viewTab, currentView === 'broken' && s.viewTabActive)}
      >
        {t('admin.products.viewBroken')}
        {imageErrorCount > 0 && (
          <span className={s.viewTabBadge}>
            <AlertTriangle className="h-3 w-3" />
          </span>
        )}
      </button>
    </div>
  );
};
