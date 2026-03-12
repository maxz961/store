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
import { s } from './page.styled';
import { categoryFormSchema, generateSlug, type CategoryFormValues } from './page.constants';
import { CategoryRow } from './CategoryRow';


const CategoriesPage = () => {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  const editingCategory = useMemo(
    () => categories.find((c) => c.id === editingId),
    [categories, editingId],
  );

  const { register, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: '', slug: '', description: '' },
  });

  watch((values, { name: field }) => {
    if (field === 'name' && !editingId) {
      setValue('slug', generateSlug(values.name ?? ''));
    }
  });

  const handleEdit = useCallback((category: Category) => {
    setEditingId(category.id);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
    });
  }, [reset]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    reset({ name: '', slug: '', description: '' });
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
      reset({ name: '', slug: '', description: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('Slug')) {
        setError('slug', { message: 'Этот slug уже занят' });
      } else if (message.includes('Название')) {
        setError('name', { message: 'Это название уже занято' });
      }
    }
  });

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  return (
    <div className={s.page}>

      <div className={s.formCard}>
        <h2 className={s.formTitle}>
          {editingId ? 'Редактировать категорию' : 'Новая категория'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className={s.formRow}>
            <TextField
              label="Название"
              placeholder="Электроника"
              hint="Видимое название категории в каталоге"
              error={errors.name?.message}
              {...register('name')}
            />
            <TextField
              label="Slug"
              placeholder="electronics"
              hint="URL-идентификатор, генерируется автоматически"
              error={errors.slug?.message}
              {...register('slug')}
            />
          </div>
          <TextField
            label="Описание"
            placeholder="Описание категории (необязательно)"
            hint="Краткое описание для страницы категории, не обязательно"
            error={errors.description?.message}
            {...register('description')}
          />

          <When condition={!!editingId && (editingCategory?._count?.products ?? 0) > 0}>
            <div className={s.editWarning}>
              <Info className={s.editWarningIcon} />
              Изменения применятся ко всем {editingCategory?._count?.products} товарам в этой категории
            </div>
          </When>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
            <When condition={!!editingId}>
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Отмена
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
                  <th className={s.th}>Категория</th>
                  <th className={s.thCenter}>Товаров</th>
                  <th className={s.thCenter}>Действия</th>
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
                        Категорий пока нет
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
        title="Удалить категорию?"
        isLoading={deleteCategory.isPending}
        description={
          <>
            Категория <strong>«{pendingDelete?.name}»</strong> будет удалена.{' '}
            <When condition={(pendingDelete?._count?.products ?? 0) > 0}>
              {pendingDelete?._count?.products} товаров потеряют категорию.
            </When>
          </>
        }
      />
    </div>
  );
};

export default CategoriesPage;
