'use client';

import { useState, useMemo, useCallback, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { When } from 'react-if';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { useProduct, useCategories, useTags } from '@/lib/hooks/useProducts';
import { useUpdateProduct, useUploadProductImages } from '@/lib/hooks/useAdmin';
import { BasicInfoSection } from '../new/BasicInfoSection';
import { PricingSection } from '../new/PricingSection';
import { CategoryTagsSection } from '../new/CategoryTagsSection';
import { ImagesSection } from '../new/ImagesSection';
import { ProductPreview } from '../new/ProductPreview';
import { s } from '../new/page.styled';
import {
  createProductFormSchema,
  FIELD_TOOLTIPS,
  type CreateProductFormValues,
} from '../new/page.constants';


const EditProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  const router = useRouter();

  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();
  const updateProduct = useUpdateProduct();
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

  const { handleSubmit, reset, watch, register, formState: { errors } } = methods;

  useEffect(() => {
    if (!product) return;
    reset({
      name: product.name,
      nameEn: product.nameEn ?? '',
      slug: product.slug,
      description: product.description,
      descriptionEn: product.descriptionEn ?? '',
      price: String(product.price),
      comparePrice: product.comparePrice ? String(product.comparePrice) : '',
      stock: String(product.stock),
      sku: product.sku ?? '',
      categoryId: product.category?.id ?? '',
      isPublished: product.isPublished,
      imageUrls: product.images.join(', '),
      tagIds: product.tags.map((t) => t.tag.id),
    });
  }, [product, reset]);

  const selectedTags = watch('tagIds');

  const handleOpenPreview = useCallback(() => setIsPreviewOpen(true), []);

  const handleClosePreview = useCallback(() => setIsPreviewOpen(false), []);

  const handleToggleTag = useCallback((id: string) => () => {
    const updated = selectedTags.includes(id)
      ? selectedTags.filter((t) => t !== id)
      : [...selectedTags, id];
    methods.setValue('tagIds', updated);
  }, [selectedTags, methods]);

  const isSubmitting = updateProduct.isPending || uploadImages.isPending;

  const onSubmit = handleSubmit(async (data) => {
    if (!product) return;

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

    updateProduct.mutate({
      id: product.id,
      ...data,
      price: parseFloat(data.price),
      comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : undefined,
      stock: parseInt(data.stock, 10),
      sku: data.sku || undefined,
      images: imageList,
    }, {
      onSuccess: () => router.push('/admin/products'),
    });
  });

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={s.page}>
        <div className={s.error}>Не удалось загрузить товар</div>
      </div>
    );
  }

  return (
    <div className={s.page}>
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
            label="Опубликован"
            tooltip={FIELD_TOOLTIPS.isPublished}
            error={errors.isPublished?.message}
            {...register('isPublished')}
          />

          <When condition={updateProduct.isError || uploadImages.isError}>
            <div className={s.error}>
              {(updateProduct.error ?? uploadImages.error) instanceof Error
                ? (updateProduct.error ?? uploadImages.error)?.message
                : 'Не удалось сохранить товар'}
            </div>
          </When>

          <div className={s.buttonsRow}>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
              className={cn('flex-1', s.previewBtn)}
            >
              Отмена
            </Button>
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
              {isSubmitting ? 'Сохранение...' : 'Сохранить товар'}
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

export default EditProductPage;
