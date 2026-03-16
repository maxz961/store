'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/TextField';
import { Spinner } from '@/components/ui/Spinner';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
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
  TAG_PRESET_COLORS,
  type TagFormValues,
} from './page.constants';
import { TagRow } from './TagRow';


type LangTab = 'uk' | 'en';

const makeEmptyValues = (): TagFormValues => ({
  name: '',
  nameEn: '',
  slug: '',
  color: DEFAULT_TAG_COLOR,
});

const TagsPage = () => {
  const { data: tags = [], isLoading } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Tag | null>(null);
  const [langTab, setLangTab] = useState<LangTab>('uk');

  const editingTag = useMemo(
    () => tags.find((t) => t.id === editingId),
    [tags, editingId],
  );

  const { register, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: makeEmptyValues(),
  });

  const colorValue = watch('color');
  const hasEnError = !!errors.nameEn;
  const hasUkError = !!errors.name;

  watch((values, { name: field }) => {
    if (field === 'name' && !editingId) {
      setValue('slug', generateSlug(values.name ?? ''));
    }
  });

  const handleSelectColor = useCallback((color: string) => () => {
    setValue('color', color);
  }, [setValue]);

  const handleSelectUk = useCallback(() => setLangTab('uk'), []);
  const handleSelectEn = useCallback(() => setLangTab('en'), []);

  const colorSwatches = useMemo(() =>
    TAG_PRESET_COLORS.map((color) => (
      <button
        key={color}
        type="button"
        title={color}
        className={cn(s.swatch, colorValue === color && s.swatchActive)}
        style={{ backgroundColor: color }}
        onClick={handleSelectColor(color)}
      />
    )), [colorValue, handleSelectColor]);

  const handleEdit = useCallback((tag: Tag) => {
    setEditingId(tag.id);
    setLangTab('uk');
    reset({
      name: tag.name,
      nameEn: tag.nameEn ?? '',
      slug: tag.slug,
      color: tag.color ?? DEFAULT_TAG_COLOR,
    });
  }, [reset]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setLangTab('uk');
    reset(makeEmptyValues());
  }, [reset]);

  const handleDelete = useCallback((tag: Tag) => {
    setPendingDelete(tag);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    deleteTag.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
  }, [pendingDelete, deleteTag]);

  const handleCancelDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (hasEnError && !hasUkError) setLangTab('en');
    try {
      if (editingId) {
        await updateTag.mutateAsync({ id: editingId, ...data });
        setEditingId(null);
      } else {
        await createTag.mutateAsync(data);
      }
      setLangTab('uk');
      reset(makeEmptyValues());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('Slug')) {
        setError('slug', { message: 'This slug is already taken' });
      } else if (message.includes('Name') || message.includes('name')) {
        setError('name', { message: 'This name is already taken' });
      }
    }
  });

  const isSubmitting = createTag.isPending || updateTag.isPending;

  return (
    <div className={s.page}>
      <div className={s.formCard}>
        <div className="flex items-center justify-between">
          <h2 className={s.formTitle}>
            {editingId ? 'Edit tag' : 'New tag'}
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
                placeholder="New arrival"
                hint="Visible tag name in the catalog"
                error={errors.name?.message}
                {...register('name')}
              />
              <TextField
                label="Slug"
                placeholder="new-arrival"
                hint="URL identifier, auto-generated"
                error={errors.slug?.message}
                {...register('slug')}
              />
              <div className={s.colorSection}>
                <label className={s.colorLabel}>Tag color</label>
                <div className={s.swatches}>
                  {colorSwatches}
                </div>
                <p className={s.colorHint}>Displayed on the tag badge</p>
              </div>
            </div>
          </When>

          <When condition={langTab === 'en'}>
            <TextField
              label="Name (EN)"
              placeholder="New arrival"
              hint="Tag name in English"
              error={errors.nameEn?.message}
              {...register('nameEn')}
            />
          </When>

          <When condition={!!editingId && (editingTag?._count?.products ?? 0) > 0}>
            <div className={s.editWarning}>
              <Info className={s.editWarningIcon} />
              Changes will apply to all {editingTag?._count?.products} products with this tag
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
                  <th className={s.th}>Tag</th>
                  <th className={s.thCenter}>Products</th>
                  <th className={s.thCenter}>Actions</th>
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
                        No tags yet
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
        title="Delete tag?"
        isLoading={deleteTag.isPending}
        description={
          <>
            Tag <strong>«{pendingDelete?.name}»</strong> will be deleted.{' '}
            <When condition={(pendingDelete?._count?.products ?? 0) > 0}>
              It will be removed from {pendingDelete?._count?.products} products.
            </When>
          </>
        }
      />
    </div>
  );
};

export default TagsPage;
