'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { If, Then, Else, When } from 'react-if';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useCategories, useTags } from '@/lib/hooks/useProducts';
import { useCreateProduct, useUploadProductImages } from '@/lib/hooks/useAdmin';
import { s } from './page.styled';
import {
  breadcrumbs,
  generateSlug,
  createProductFormSchema,
  FIELD_TOOLTIPS,
  type CreateProductFormValues,
} from './page.constants';
import { BasicInfoSection } from './BasicInfoSection';
import { PricingSection } from './PricingSection';
import { CategoryTagsSection } from './CategoryTagsSection';
import { ImagesSection } from './ImagesSection';
import { ProductPreview } from './ProductPreview';


const NewProductPage = () => {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();
  const createProduct = useCreateProduct();
  const uploadImages = useUploadProductImages();

  const [files, setFiles] = useState<File[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories],
  );

  const methods = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      slug: '',
      description: '',
      descriptionEn: '',
      price: '',
      comparePrice: '',
      stock: '0',
      sku: '',
      categoryId: '',
      isPublished: false,
      imageUrls: '',
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

  const handleOpenPreview = useCallback(() => setIsPreviewOpen(true), []);

  const handleClosePreview = useCallback(() => setIsPreviewOpen(false), []);

  const isSubmitting = createProduct.isPending || uploadImages.isPending;

  const onSubmit = handleSubmit(async (data) => {
    let imageList: string[] = [];

    if (files.length > 0) {
      const uploaded = await uploadImages.mutateAsync(files);
      imageList = [...imageList, ...uploaded.urls];
    }

    const urlImages = data.imageUrls
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
    imageList = [...imageList, ...urlImages];

    if (imageList.length === 0) {
      methods.setError('imageUrls', { message: 'Добавьте хотя бы одно изображение' });
      return;
    }

    try {
      await createProduct.mutateAsync({
        ...data,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : undefined,
        stock: parseInt(data.stock, 10),
        sku: data.sku || undefined,
        images: imageList,
      });
      router.push('/admin/products');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('Slug')) {
        methods.setError('slug', { message: 'Этот slug уже занят' });
      } else if (message.includes('Название')) {
        methods.setError('name', { message: 'Это название уже занято' });
      } else {
        methods.setError('root', { message: message || 'Не удалось создать товар' });
      }
    }
  });

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
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
          <ImagesSection files={files} onFilesChange={setFiles} />

          <CheckboxField
            label="Опубликовать сразу"
            tooltip={FIELD_TOOLTIPS.isPublished}
            error={errors.isPublished?.message}
            {...register('isPublished')}
          />

          <When condition={uploadImages.isError || !!errors.root}>
            <div className={s.error}>
              {uploadImages.isError
                ? (uploadImages.error instanceof Error ? uploadImages.error.message : 'Не удалось загрузить изображения')
                : errors.root?.message}
            </div>
          </When>

          <div className={s.buttonsRow}>
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenPreview}
              className={cn('flex-1', s.previewBtn)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Предпросмотр
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              <If condition={isSubmitting}>
                <Then><Spinner size="sm" /><span className="ml-2">Создание...</span></Then>
                <Else>Создать товар</Else>
              </If>
            </Button>
          </div>
        </form>

        <ProductPreview
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          files={files}
        />
      </FormProvider>
    </div>
  );
};

export default NewProductPage;
