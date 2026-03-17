'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { If, Then, Else, When } from 'react-if';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useProducts } from '@/lib/hooks/useProducts';
import {
  useCreatePromotion,
  usePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from '@/lib/hooks/usePromotions';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import {
  breadcrumbs as createBreadcrumbs,
  generateSlug,
  createPromotionFormSchema,
  type CreatePromotionFormValues,
} from './page.constants';
import { BasicInfoSection } from './BasicInfoSection';
import { ScheduleSection } from './ScheduleSection';
import { DiscountSection } from './DiscountSection';
import { BannerSection } from './BannerSection';
import { ProductsSection } from './ProductsSection';


const formatDateForInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

interface PromotionFormProps {
  promotionId?: string;
}


export const PromotionForm = ({ promotionId }: PromotionFormProps) => {
  const router = useRouter();
  const { t } = useLanguage();
  const isEditMode = !!promotionId;
  const formRef = useRef<HTMLFormElement>(null);
  const [langTab, setLangTab] = useState<'uk' | 'en'>('uk');

  const { data: promotion, isLoading, isError } = usePromotion(promotionId ?? '');
  const { data: productsData } = useProducts({});
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion(promotionId ?? '');
  const deletePromotion = useDeletePromotion();

  const products = useMemo(
    () => (productsData?.items ?? []).map((p) => ({ id: p.id, name: p.name })),
    [productsData],
  );

  const methods = useForm<CreatePromotionFormValues>({
    resolver: zodResolver(createPromotionFormSchema),
    defaultValues: {
      title: '',
      titleEn: '',
      slug: '',
      description: '',
      descriptionEn: '',
      bannerImageUrl: '',
      bannerBgColor: '#e8f5e9',
      startDate: '',
      endDate: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      isActive: true,
      position: '0',
      link: '',
      productIds: [],
    },
  });

  const { handleSubmit, reset, watch, setValue, getValues } = methods;

  useEffect(() => {
    if (!promotion) return;

    reset({
      title: promotion.title,
      titleEn: promotion.titleEn ?? '',
      slug: promotion.slug,
      description: promotion.description ?? '',
      descriptionEn: promotion.descriptionEn ?? '',
      bannerImageUrl: promotion.bannerImageUrl,
      bannerBgColor: promotion.bannerBgColor ?? '',
      startDate: formatDateForInput(promotion.startDate),
      endDate: formatDateForInput(promotion.endDate),
      discountType: promotion.discountType,
      discountValue: String(promotion.discountValue),
      isActive: promotion.isActive,
      position: String(promotion.position),
      link: promotion.link ?? '',
      productIds: (promotion.products ?? []).map((pp) => pp.productId),
    });
  }, [promotion, reset]);

  const selectedProductIds = watch('productIds');

  watch((values, { name: field }) => {
    if (field === 'title' && !isEditMode) {
      setValue('slug', generateSlug(values.title ?? ''));
    }
  });

  const handleLangTabChange = useCallback((tab: 'uk' | 'en') => {
    setLangTab(tab);
  }, []);

  const handleToggleProduct = (id: string) => () => {
    const current = getValues('productIds');
    const updated = current.includes(id)
      ? current.filter((pid) => pid !== id)
      : [...current, id];
    setValue('productIds', updated);
  };

  const handleDelete = useCallback(() => {
    if (!promotionId) return;
    deletePromotion.mutate(promotionId, {
      onSuccess: () => router.push('/admin/promotions'),
    });
  }, [promotionId, deletePromotion, router]);

  const handleInvalid = useCallback((fieldErrors: FieldErrors<CreatePromotionFormValues>) => {
    const enHasError = !!(fieldErrors.titleEn || fieldErrors.descriptionEn);
    const ukHasError = !!(fieldErrors.title || fieldErrors.slug || fieldErrors.description);
    if (enHasError && !ukHasError) setLangTab('en');
    else if (ukHasError) setLangTab('uk');
    setTimeout(() => {
      formRef.current?.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, []);

  const onSubmit = handleSubmit((data) => {
    const payload = {
      title: data.title,
      titleEn: data.titleEn,
      slug: data.slug,
      description: data.description || undefined,
      descriptionEn: data.descriptionEn || undefined,
      bannerImageUrl: data.bannerImageUrl,
      bannerBgColor: data.bannerBgColor || undefined,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      discountType: data.discountType,
      discountValue: parseFloat(data.discountValue),
      isActive: data.isActive,
      position: parseInt(data.position, 10),
      link: data.link || undefined,
      productIds: data.productIds,
    };

    if (isEditMode) {
      updatePromotion.mutate(payload, {
        onSuccess: () => router.push('/admin/promotions'),
      });
    } else {
      createPromotion.mutate(payload, {
        onSuccess: () => router.push('/admin/promotions'),
      });
    }
  }, handleInvalid);

  const isSubmitting = createPromotion.isPending || updatePromotion.isPending;
  const submitError = isEditMode ? updatePromotion.error : createPromotion.error;
  const isSubmitError = isEditMode ? updatePromotion.isError : createPromotion.isError;

  const breadcrumbItems = useMemo(() => {
    if (isEditMode) {
      return [
        { label: 'Admin', href: '/admin/dashboard' },
        { label: t('admin.promotion.breadcrumbLabel'), href: '/admin/promotions' },
        { label: promotion?.title ?? '' },
      ];
    }
    return createBreadcrumbs;
  }, [isEditMode, t, promotion?.title]);

  if (isEditMode && isLoading) {
    return (
      <div className={s.page}>
        <Spinner />
      </div>
    );
  }

  if (isEditMode && isError) {
    return (
      <div className={s.page}>
        <div className={s.error}>{t('admin.promotion.loadFailed')}</div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbItems} />
      <FormProvider {...methods}>
        <form ref={formRef} onSubmit={onSubmit} className={s.form}>
          <BasicInfoSection langTab={langTab} onTabChange={handleLangTabChange} />
          <ScheduleSection />
          <DiscountSection />
          <BannerSection />
          <ProductsSection
            products={products}
            selectedIds={selectedProductIds}
            onToggle={handleToggleProduct}
          />

          <When condition={isSubmitError}>
            <div className={s.error}>
              {submitError instanceof Error
                ? submitError.message
                : isEditMode ? t('admin.promotion.updateFailed') : t('admin.promotion.createFailed')}
            </div>
          </When>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            <If condition={isSubmitting}>
              <Then>
                <Spinner size="sm" />
                <span className="ml-2">
                  {isEditMode ? t('admin.promotion.saving') : t('admin.promotion.creating')}
                </span>
              </Then>
              <Else>
                {isEditMode ? t('admin.promotion.saveChanges') : t('admin.promotion.create')}
              </Else>
            </If>
          </Button>
        </form>
      </FormProvider>

      <When condition={isEditMode}>
        <div className={s.dangerZone}>
          <h2 className={s.dangerTitle}>{t('admin.promotion.dangerZone')}</h2>
          <p className={s.dangerText}>{t('admin.promotion.dangerText')}</p>
          <div className={s.dangerActions}>
            <Button
              type="button"
              variant="destructive"
              disabled={deletePromotion.isPending}
              onClick={handleDelete}
            >
              <If condition={deletePromotion.isPending}>
                <Then>
                  <Spinner size="sm" />
                  <span className="ml-2">{t('admin.promotion.deleting')}</span>
                </Then>
                <Else>{t('admin.promotion.delete')}</Else>
              </If>
            </Button>
          </div>
        </div>
      </When>
    </div>
  );
};
