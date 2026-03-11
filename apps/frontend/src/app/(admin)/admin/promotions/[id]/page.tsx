'use client';

import { useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { When } from 'react-if';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/lib/hooks/useProducts';
import { usePromotion, useUpdatePromotion, useDeletePromotion } from '@/lib/hooks/usePromotions';
import { s } from './page.styled';
import { makeBreadcrumbs } from './page.constants';
import {
  createPromotionFormSchema,
  type CreatePromotionFormValues,
} from '../new/page.constants';
import { BasicInfoSection } from '../new/BasicInfoSection';
import { ScheduleSection } from '../new/ScheduleSection';
import { DiscountSection } from '../new/DiscountSection';
import { BannerSection } from '../new/BannerSection';
import { ProductsSection } from '../new/ProductsSection';


const formatDateForInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EditPromotionPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: promotion, isLoading, isError } = usePromotion(id);
  const { data: productsData } = useProducts({});
  const updatePromotion = useUpdatePromotion(id);
  const deletePromotion = useDeletePromotion();

  const products = useMemo(
    () => (productsData?.items ?? []).map((p) => ({ id: p.id, name: p.name })),
    [productsData],
  );

  const methods = useForm<CreatePromotionFormValues>({
    resolver: zodResolver(createPromotionFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      bannerImageUrl: '',
      bannerBgColor: '',
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

  const { handleSubmit, reset, watch, setValue } = methods;

  useEffect(() => {
    if (!promotion) return;

    reset({
      title: promotion.title,
      slug: promotion.slug,
      description: promotion.description ?? '',
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

  const handleToggleProduct = (productId: string) => () => {
    const updated = selectedProductIds.includes(productId)
      ? selectedProductIds.filter((pid) => pid !== productId)
      : [...selectedProductIds, productId];
    setValue('productIds', updated);
  };

  const handleDelete = () => {
    deletePromotion.mutate(id, {
      onSuccess: () => router.push('/admin/promotions'),
    });
  };

  const onSubmit = handleSubmit((data) => {
    updatePromotion.mutate({
      title: data.title,
      slug: data.slug,
      description: data.description || undefined,
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

  const breadcrumbs = makeBreadcrumbs(promotion?.title ?? 'Редактирование');

  if (isLoading) {
    return (
      <div className={s.page}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={s.page}>
        <div className={s.error}>Не удалось загрузить акцию</div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <h1 className={s.pageTitle}>Редактировать акцию</h1>

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

          <When condition={updatePromotion.isError}>
            <div className={s.error}>
              {updatePromotion.error instanceof Error
                ? updatePromotion.error.message
                : 'Не удалось обновить акцию'}
            </div>
          </When>

          <Button type="submit" disabled={updatePromotion.isPending} className="w-full">
            {updatePromotion.isPending ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </form>
      </FormProvider>

      <div className={s.dangerZone}>
        <h2 className={s.dangerTitle}>Опасная зона</h2>
        <p className={s.dangerText}>
          Удаление акции необратимо. Баннер исчезнет из каталога, а привязка к товарам будет удалена.
        </p>
        <div className={s.dangerActions}>
          <Button
            type="button"
            variant="destructive"
            disabled={deletePromotion.isPending}
            onClick={handleDelete}
          >
            {deletePromotion.isPending ? 'Удаление...' : 'Удалить акцию'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPromotionPage;
