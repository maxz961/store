'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { If, Then, Else, When } from 'react-if';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/TextField';
import { Spinner } from '@/components/ui/Spinner';
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from '@/lib/hooks/useProducts';
import type { Tag } from '@/lib/hooks/useProducts';
import { s } from './page.styled';
import {
  tagFormSchema,
  generateSlug,
  DEFAULT_TAG_COLOR,
  type TagFormValues,
} from './page.constants';
import { TagRow } from './TagRow';


const breadcrumbs = [
  { label: 'Теги' },
];

const TagsPage = () => {
  const { data: tags = [], isLoading } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: { name: '', slug: '', color: DEFAULT_TAG_COLOR },
  });

  const colorValue = watch('color');

  watch((values, { name: field }) => {
    if (field === 'name' && !editingId) {
      setValue('slug', generateSlug(values.name ?? ''));
    }
  });

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('color', e.target.value);
  }, [setValue]);

  const handleEdit = useCallback((tag: Tag) => {
    setEditingId(tag.id);
    reset({
      name: tag.name,
      slug: tag.slug,
      color: tag.color ?? DEFAULT_TAG_COLOR,
    });
  }, [reset]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    reset({ name: '', slug: '', color: DEFAULT_TAG_COLOR });
  }, [reset]);

  const handleDelete = useCallback((id: string) => {
    deleteTag.mutate(id);
  }, [deleteTag]);

  const onSubmit = handleSubmit(async (data) => {
    if (editingId) {
      await updateTag.mutateAsync({ id: editingId, ...data });
      setEditingId(null);
    } else {
      await createTag.mutateAsync(data);
    }
    reset({ name: '', slug: '', color: DEFAULT_TAG_COLOR });
  });

  const isSubmitting = createTag.isPending || updateTag.isPending;

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <h1 className={s.title}>Теги</h1>

      <div className={s.formCard}>
        <h2 className={s.formTitle}>
          {editingId ? 'Редактировать тег' : 'Новый тег'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className={s.formRow}>
            <TextField
              label="Название"
              placeholder="Новинка"
              error={errors.name?.message}
              {...register('name')}
            />
            <TextField
              label="Slug"
              placeholder="new-arrival"
              error={errors.slug?.message}
              {...register('slug')}
            />
            <div>
              <label className={s.colorLabel}>Цвет</label>
              <div className={s.colorWrapper}>
                <input
                  type="color"
                  className={s.colorInput}
                  value={colorValue ?? DEFAULT_TAG_COLOR}
                  onChange={handleColorChange}
                />
                <span className={s.colorValue}>{colorValue}</span>
              </div>
            </div>
          </div>

          <When condition={createTag.isError || updateTag.isError}>
            <div className={s.error}>
              {(createTag.error ?? updateTag.error)?.message}
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
                  <th className={s.th}>Тег</th>
                  <th className={s.thCenter}>Товаров</th>
                  <th className={s.thCenter}>Действия</th>
                </tr>
              </thead>
              <tbody>
                <If condition={tags.length > 0}>
                  <Then>
                    {tags.map((tag) => (
                      <TagRow
                        key={tag.id}
                        tag={tag}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </Then>
                  <Else>
                    <tr>
                      <td colSpan={3} className={s.emptyRow}>
                        Тегов пока нет
                      </td>
                    </tr>
                  </Else>
                </If>
              </tbody>
            </table>
          </div>
        </Else>
      </If>
    </div>
  );
};

export default TagsPage;
