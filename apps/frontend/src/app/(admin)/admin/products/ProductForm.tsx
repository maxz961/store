'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
import { useLanguage } from '@/lib/i18n';
import { useProduct, useCategories, useTags } from '@/lib/hooks/useProducts';
import { useCreateProduct, useUpdateProduct, useUploadProductImages } from '@/lib/hooks/useAdmin';
import { BasicInfoSection } from './new/BasicInfoSection';
import { PricingSection } from './new/PricingSection';
import { CategoryTagsSection } from './new/CategoryTagsSection';
import { ImagesSection } from './new/ImagesSection';
import { ProductPreview } from './new/ProductPreview';
import { s } from './new/page.styled';
import {
  generateSlug,
  buildProductFormSchema,
  FIELD_TOOLTIPS,
  type CreateProductFormValues,
} from './new/page.constants';


interface ProductFormProps {
  mode: 'create' | 'edit';
  productSlug?: string;
}


export const ProductForm = ({ mode, productSlug }: ProductFormProps) => {
  const isEdit = mode === 'edit';
  const router = useRouter();
  const { t } = useLanguage();

  const { data: product, isLoading, isError } = useProduct(productSlug ?? '');
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImages = useUploadProductImages();

  const [files, setFiles] = useState<File[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories],
  );

  const discountTagId = useMemo(
    () => tags.find((t) => /зниж|знижк|sale|скид/i.test(t.name))?.id,
    [tags],
  );

  const breadcrumbs = useMemo(() => [
    { label: t('nav.admin'), href: '/admin/dashboard' },
    { label: t('admin.dashboard.products'), href: '/admin/products' },
    { label: isEdit ? (product?.name ?? t('admin.product.edit')) : t('admin.product.new') },
  ], [isEdit, product?.name, t]);

  const productFormSchema = useMemo(() => buildProductFormSchema({
    required: t('admin.product.validation.required'),
    nameMax: t('admin.product.validation.nameMax'),
    slugFormat: t('admin.product.validation.slugFormat'),
    descriptionMin: t('admin.product.validation.descriptionMin'),
    pricePositive: t('admin.product.validation.pricePositive'),
    stockWhole: t('admin.product.validation.stockWhole'),
    categoryRequired: t('admin.product.validation.categoryRequired'),
    imageUrlsInvalid: t('admin.product.validation.imageUrlsInvalid'),
  }), [t]);

  const methods = useForm<CreateProductFormValues>({
    resolver: zodResolver(productFormSchema),
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

  const { handleSubmit, reset, watch, setValue, register, formState: { errors } } = methods;

  useEffect(() => {
    if (!isEdit || !product) return;
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
  }, [isEdit, product, reset]);

  const selectedTags = watch('tagIds');

  watch((values, { name: field }) => {
    if (field === 'name' && !isEdit) {
      setValue('slug', generateSlug(values.name ?? ''));
    }
    if (field === 'comparePrice') {
      if (!discountTagId) return;
      const current = values.tagIds ?? [];
      if (values.comparePrice) {
        if (!current.includes(discountTagId)) {
          setValue('tagIds', [...current, discountTagId]);
        }
      } else {
        setValue('tagIds', current.filter((id) => id !== discountTagId));
      }
    }
  });

  const handleToggleTag = useCallback((id: string) => () => {
    const updated = selectedTags.includes(id)
      ? selectedTags.filter((t) => t !== id)
      : [...selectedTags, id];
    setValue('tagIds', updated);
  }, [selectedTags, setValue]);

  const handleOpenPreview = useCallback(() => setIsPreviewOpen(true), []);

  const handleClosePreview = useCallback(() => setIsPreviewOpen(false), []);

  const handleCancel = useCallback(() => router.push('/admin/products'), [router]);

  const scrollToFirstError = useCallback(() => {
    // Double rAF: first frame lets React run useEffect (tab switch in BasicInfoSection),
    // second frame waits for the re-render after tab switch to paint error elements.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = formRef.current?.querySelector<HTMLElement>('.text-destructive');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }, []);

  const isSubmitting = createProduct.isPending || updateProduct.isPending || uploadImages.isPending;

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
      methods.setError('imageUrls', { message: t('admin.product.validation.imageRequired') });
      scrollToFirstError();
      return;
    }

    const { imageUrls: _, ...formData } = data;
    const payload = {
      ...formData,
      price: parseFloat(data.price),
      comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : undefined,
      stock: parseInt(data.stock, 10),
      sku: data.sku || undefined,
      images: imageList,
    };

    try {
      if (isEdit && product) {
        await updateProduct.mutateAsync({ id: product.id, ...payload });
      } else {
        await createProduct.mutateAsync(payload);
      }
      router.push('/admin/products');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('Slug')) {
        methods.setError('slug', { message: t('admin.product.validation.slugTaken') });
      } else if (message.includes('Название')) {
        methods.setError('name', { message: t('admin.product.validation.nameTaken') });
      } else {
        methods.setError('root', {
          message: message || t(isEdit ? 'admin.product.validation.saveFailed' : 'admin.product.validation.createFailed'),
        });
      }
      scrollToFirstError();
    }
  }, scrollToFirstError);

  if (isEdit && isLoading) {
    return (
      <div className={s.page}>
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isEdit && (isError || !product)) {
    return (
      <div className={s.page}>
        <div className={s.error}>{t('admin.product.loadFailed')}</div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <FormProvider {...methods}>
        <form ref={formRef} onSubmit={onSubmit} className={s.form}>
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
            label={isEdit ? t('admin.product.publishedLabel') : t('admin.product.publishNow')}
            tooltip={FIELD_TOOLTIPS.isPublished}
            error={errors.isPublished?.message}
            {...register('isPublished')}
          />

          <When condition={uploadImages.isError || !!errors.root}>
            <div className={s.error}>
              {uploadImages.isError
                ? (uploadImages.error instanceof Error ? uploadImages.error.message : t('admin.product.uploadFailed'))
                : errors.root?.message}
            </div>
          </When>

          <div className={s.buttonsRow}>
            <When condition={isEdit}>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className={cn('flex-1', s.previewBtn)}
              >
                {t('admin.product.cancel')}
              </Button>
            </When>
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenPreview}
              className={cn('flex-1', s.previewBtn)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {t('admin.product.preview')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              <If condition={isSubmitting}>
                <Then>
                  <Spinner size="sm" />
                  <span className="ml-2">{isEdit ? t('admin.product.saving') : t('admin.product.creating')}</span>
                </Then>
                <Else>{isEdit ? t('admin.product.save') : t('admin.product.create')}</Else>
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
