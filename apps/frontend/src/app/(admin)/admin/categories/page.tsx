'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
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
import type { Category } from '@/lib/hooks/useProducts';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import { categoryFormSchema, generateSlug, type CategoryFormValues } from './page.constants';
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

  const { register, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  const hasEnError = !!(errors.nameEn || errors.descriptionEn);
  const hasUkError = !!(errors.name || errors.description);

  watch((values, { name: field }) => {
    if (field === 'name' && !editingId) {
      setValue('slug', generateSlug(values.name ?? ''));
    }
  });

  const handleSelectUk = useCallback(() => setLangTab('uk'), []);
  const handleSelectEn = useCallback(() => setLangTab('en'), []);

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
    if (hasEnError && !hasUkError) setLangTab('en');
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
        setError('slug', { message: 'This slug is already taken' });
      } else if (message.includes('Name') || message.includes('name')) {
        setError('name', { message: 'This name is already taken' });
      }
    }
  });

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  return (
    <div className={s.page}>

      <div className={s.formCard}>
        <div className="flex items-center justify-between">
          <h2 className={s.formTitle}>
            {editingId ? 'Edit category' : 'New category'}
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
                label="Name (UK)"
                placeholder="Electronics"
                hint="Visible category name in the catalog"
                error={errors.name?.message}
                {...register('name')}
              />
              <TextField
                label="Slug"
                placeholder="electronics"
                hint="URL identifier, auto-generated"
                error={errors.slug?.message}
                {...register('slug')}
              />
            </div>
            <TextField
              label="Description (UK)"
              placeholder="Category description (optional)"
              hint="Short description for the category page, optional"
              error={errors.description?.message}
              {...register('description')}
            />
          </When>

          <When condition={langTab === 'en'}>
            <TextField
              label="Name (EN)"
              placeholder="Electronics"
              hint="Category name in English"
              error={errors.nameEn?.message}
              {...register('nameEn')}
            />
            <TextField
              label="Description (EN)"
              placeholder="Category description in English (optional)"
              hint="Short description in English, optional"
              error={errors.descriptionEn?.message}
              {...register('descriptionEn')}
            />
          </When>

          <When condition={!!editingId && (editingCategory?._count?.products ?? 0) > 0}>
            <div className={s.editWarning}>
              <Info className={s.editWarningIcon} />
              Changes will apply to all {editingCategory?._count?.products} products in this category
            </div>
          </When>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              <If condition={isSubmitting}>
                <Then><Spinner size="sm" /><span className="ml-2">{editingId ? 'Saving...' : 'Creating...'}</span></Then>
                <Else>{editingId ? 'Save' : 'Create'}</Else>
              </If>
            </Button>
            <When condition={!!editingId}>
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancel
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
                  <th className={s.th}>Category</th>
                  <th className={s.thCenter}>Products</th>
                  <th className={s.thCenter}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <If condition={categories.length > 0}>
                  <Then>
                    {categories.map((category) => (
                      <CategoryRow
                        key={category.id}
                        category={category}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </Then>
                  <Else>
                    <tr>
                      <td colSpan={3} className={s.emptyRow}>
                        No categories yet
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
        title="Delete category?"
        isLoading={deleteCategory.isPending}
        description={
          <>
            Category <strong>«{pendingDelete?.name}»</strong> will be deleted.{' '}
            <When condition={(pendingDelete?._count?.products ?? 0) > 0}>
              {pendingDelete?._count?.products} products will lose their category.
            </When>
          </>
        }
      />
    </div>
  );
};

export default CategoriesPage;
