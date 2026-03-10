'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { When } from 'react-if';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { useCategories, useTags } from '@/lib/hooks/useProducts';
import { useCreateProduct } from '@/lib/hooks/useAdmin';
import { s } from './page.styled';
import {
  breadcrumbs,
  generateSlug,
  createProductFormSchema,
  type CreateProductFormValues,
} from './page.constants';
import { BasicInfoSection } from './BasicInfoSection';
import { PricingSection } from './PricingSection';
import { CategoryTagsSection } from './CategoryTagsSection';
import { ImagesSection } from './ImagesSection';


const NewProductPage = () => {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();
  const createProduct = useCreateProduct();

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories],
  );

  const methods = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: '',
      comparePrice: '',
      stock: '0',
      sku: '',
      categoryId: '',
      isPublished: false,
      images: '',
      tagIds: [],
    },
  });

  const { handleSubmit, watch, setValue, register, formState: { errors } } = methods;

  const selectedTags = watch('tagIds');

  watch((values, { name: field }) => {
    if (field === 'name') {
      setValue('slug', generateSlug(values.name ?? ''));
    }
  });

  const handleToggleTag = (id: string) => () => {
    const updated = selectedTags.includes(id)
      ? selectedTags.filter((t) => t !== id)
      : [...selectedTags, id];
    setValue('tagIds', updated);
  };

  const onSubmit = handleSubmit((data) => {
    createProduct.mutate({
      ...data,
      price: parseFloat(data.price),
      comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : undefined,
      stock: parseInt(data.stock, 10),
      sku: data.sku || undefined,
      images: data.images.split(',').map((u) => u.trim()).filter(Boolean),
    }, {
      onSuccess: () => router.push('/admin/products'),
    });
  });

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <h1 className={s.pageTitle}>Новый товар</h1>

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className={s.form}>
          <BasicInfoSection />
          <PricingSection />
          <CategoryTagsSection
            categoryOptions={categoryOptions}
            tags={tags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
          />
          <ImagesSection />

          <CheckboxField
            label="Опубликовать сразу"
            error={errors.isPublished?.message}
            {...register('isPublished')}
          />

          <When condition={createProduct.isError}>
            <div className={s.error}>
              {createProduct.error instanceof Error ? createProduct.error.message : 'Не удалось создать товар'}
            </div>
          </When>

          <Button type="submit" disabled={createProduct.isPending} className="w-full">
            {createProduct.isPending ? 'Создание...' : 'Создать товар'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewProductPage;
