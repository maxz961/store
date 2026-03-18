'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { If, Then, Else, When } from 'react-if';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/TextField';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/lib/hooks/useProducts';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Category } from '@/lib/hooks/useProducts';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import { buildCategoryFormSchema, generateSlug, sanitizeSlugInput, type CategoryFormValues } from './page.constants';
import { CategoryRow } from './CategoryRow';


type LangTab = 'uk' | 'en';

const EMPTY_VALUES: CategoryFormValues = {
  name: '',
  nameEn: '',
  slug: '',
  description: '',
  descriptionEn: '',
};

const CategoriesPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [langTab, setLangTab] = useState<LangTab>('uk');

  const editingCategory = useMemo(
    () => categories.find((c) => c.id === editingId),
    [categories, editingId],
  );

  const categoryFormSchema = useMemo(() => buildCategoryFormSchema({
    required: t('admin.category.validation.required'),
    nameMax: t('admin.category.validation.nameMax'),
    slugFormat: t('admin.category.validation.slugFormat'),
  }), [t]);

  const { register, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  watch((values, { name: field }) => {
    if (field === 'name' && !editingId) {
      setValue('slug', generateSlug(values.name ?? ''));
    }
    if (field === 'slug') {
      const sanitized = sanitizeSlugInput(values.slug ?? '');
      if (sanitized !== values.slug) setValue('slug', sanitized);
    }
  });

  const handleSelectUk = useCallback(() => setLangTab('uk'), []);
  const handleSelectEn = useCallback(() => setLangTab('en'), []);

  const handleInvalid = useCallback((fieldErrors: FieldErrors<CategoryFormValues>) => {
    const enHasError = !!(fieldErrors.nameEn || fieldErrors.descriptionEn);
    const ukHasError = !!(fieldErrors.name || fieldErrors.slug || fieldErrors.description);
    if (enHasError && !ukHasError) setLangTab('en');
    else if (ukHasError) setLangTab('uk');
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setEditingId(category.id);
    setLangTab('uk');
    reset({
      name: category.name,
      nameEn: category.nameEn ?? '',
      slug: category.slug,
      description: category.description ?? '',
      descriptionEn: category.descriptionEn ?? '',
    });
  }, [reset]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setLangTab('uk');
    reset(EMPTY_VALUES);
  }, [reset]);

  const handleDelete = useCallback((category: Category) => {
    setPendingDelete(category);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    deleteCategory.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
  }, [pendingDelete, deleteCategory]);

  const handleCancelDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, ...data });
        setEditingId(null);
      } else {
        await createCategory.mutateAsync(data);
      }
      setLangTab('uk');
      reset(EMPTY_VALUES);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('Slug')) {
        setError('slug', { message: t('admin.category.slugTaken') });
        setLangTab('uk');
      } else if (message.includes('Name') || message.includes('name')) {
        setError('name', { message: t('admin.category.nameTaken') });
        setLangTab('uk');
      }
    }
  }, handleInvalid);

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  return (
    <div className={s.page}>

      <div className={s.formCard}>
        <div className="flex items-center justify-between">
          <h2 className={s.formTitle}>
            {editingId ? t('admin.category.edit') : t('admin.category.new')}
          </h2>
          <div className={s.langTabs}>
            <button
              type="button"
              onClick={handleSelectUk}
              className={cn(s.langTab, langTab === 'uk' && s.langTabActive)}
            >
              🇺🇦 UK
            </button>
            <button
              type="button"
              onClick={handleSelectEn}
              className={cn(s.langTab, langTab === 'en' && s.langTabActive)}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <When condition={langTab === 'uk'}>
            <div className={s.formRow}>
              <TextField
                label={t('admin.category.name')}
                placeholder={t('admin.category.namePlaceholder')}
                hint={t('admin.category.nameHint')}
                error={errors.name?.message}
                {...register('name')}
              />
              <TextField
                label={t('admin.category.slug')}
                placeholder={t('admin.category.slugPlaceholder')}
                hint={t('admin.category.slugHint')}
                error={errors.slug?.message}
                {...register('slug')}
              />
            </div>
            <TextField
              label={t('admin.category.description')}
              placeholder={t('admin.category.descriptionPlaceholder')}
              hint={t('admin.category.descriptionHint')}
              error={errors.description?.message}
              {...register('description')}
            />
          </When>

          <When condition={langTab === 'en'}>
            <TextField
              label={t('admin.category.nameEn')}
              placeholder={t('admin.category.namePlaceholder')}
              hint={t('admin.category.nameEnHint')}
              error={errors.nameEn?.message}
              {...register('nameEn')}
            />
            <TextField
              label={t('admin.category.descriptionEn')}
              placeholder={t('admin.category.descriptionEnPlaceholder')}
              hint={t('admin.category.descriptionEnHint')}
              error={errors.descriptionEn?.message}
              {...register('descriptionEn')}
            />
          </When>

          <When condition={!!editingId && (editingCategory?._count?.products ?? 0) > 0}>
            <div className={s.editWarning}>
              <Info className={s.editWarningIcon} />
              {t('admin.category.editWarningBefore')} {editingCategory?._count?.products} {t('admin.category.editWarningAfter')}
            </div>
          </When>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              <If condition={isSubmitting}>
                <Then><Spinner size="sm" /><span className="ml-2">{editingId ? t('admin.category.saving') : t('admin.category.creating')}</span></Then>
                <Else>{editingId ? t('admin.category.save') : t('admin.category.create')}</Else>
              </If>
            </Button>
            <When condition={!!editingId}>
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                {t('admin.category.cancel')}
              </Button>
            </When>
          </div>
        </form>
      </div>

      <If condition={isLoading}>
        <Then>
          <div className="mt-8 flex justify-center">
            <Spinner />
          </div>
        </Then>
        <Else>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead className={s.thead}>
                <tr>
                  <th className={s.th}>{t('admin.category.tableTitle')}</th>
                  <th className={s.thCenter}>{t('admin.category.tableProducts')}</th>
                  <th className={s.thCenter}>{t('admin.category.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                <If condition={categories.length > 0}>
                  <Then>
                    {categories.map((category) => (
                      <CategoryRow
                        key={category.id}
                        category={category}
                        canDelete={isAdmin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </Then>
                  <Else>
                    <tr>
                      <td colSpan={3} className={s.emptyRow}>
                        {t('admin.category.noItems')}
                      </td>
                    </tr>
                  </Else>
                </If>
              </tbody>
            </table>
          </div>
        </Else>
      </If>

      <ConfirmModal
        open={!!pendingDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={t('admin.category.confirmDeleteTitle')}
        isLoading={deleteCategory.isPending}
        description={
          <>
            {t('admin.category.confirmDeletePrefix')} <strong>«{pendingDelete?.name}»</strong> {t('admin.category.confirmDeleteSuffix')}{' '}
            <When condition={(pendingDelete?._count?.products ?? 0) > 0}>
              {pendingDelete?._count?.products} {t('admin.category.confirmDeleteProductsSuffix')}
            </When>
          </>
        }
      />
    </div>
  );
};

export default CategoriesPage;
