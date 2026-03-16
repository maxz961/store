'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useProducts } from '@/lib/hooks/useProducts';
import { useCreatePromotion } from '@/lib/hooks/usePromotions';
import { s } from './page.styled';
import {
  breadcrumbs,
  generateSlug,
  createPromotionFormSchema,
  type CreatePromotionFormValues,
} from './page.constants';
import { BasicInfoSection } from './BasicInfoSection';
import { ScheduleSection } from './ScheduleSection';
import { DiscountSection } from './DiscountSection';
import { BannerSection } from './BannerSection';
import { ProductsSection } from './ProductsSection';


const NewPromotionPage = () => {
  const router = useRouter();
  const { data: productsData } = useProducts({});
  const createPromotion = useCreatePromotion();

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

  const { handleSubmit, watch, setValue } = methods;

  const selectedProductIds = watch('productIds');

  watch((values, { name: field }) => {
    if (field === 'title') {
      setValue('slug', generateSlug(values.title ?? ''));
    }
  });

  const handleToggleProduct = (id: string) => () => {
    const updated = selectedProductIds.includes(id)
      ? selectedProductIds.filter((pid) => pid !== id)
      : [...selectedProductIds, id];
    setValue('productIds', updated);
  };

  const onSubmit = handleSubmit((data) => {
    createPromotion.mutate({
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
    }, {
      onSuccess: () => router.push('/admin/promotions'),
    });
  });

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className={s.form}>
          <BasicInfoSection />
          <ScheduleSection />
          <DiscountSection />
          <BannerSection />
          <ProductsSection
            products={products}
            selectedIds={selectedProductIds}
            onToggle={handleToggleProduct}
          />

          <When condition={createPromotion.isError}>
            <div className={s.error}>
              {createPromotion.error instanceof Error
                ? createPromotion.error.message
                : 'Failed to create promotion'}
            </div>
          </When>

          <Button type="submit" disabled={createPromotion.isPending} className="w-full">
            {createPromotion.isPending ? 'Creating...' : 'Create promotion'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewPromotionPage;
