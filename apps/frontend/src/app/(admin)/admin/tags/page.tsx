'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
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
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import {
  buildTagFormSchema,
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
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
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

  const tagFormSchema = useMemo(() => buildTagFormSchema({
    required: t('admin.tag.validation.required'),
    nameMax: t('admin.tag.validation.nameMax'),
    slugFormat: t('admin.tag.validation.slugFormat'),
  }), [t]);

  const { register, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: makeEmptyValues(),
  });

  const colorValue = watch('color');

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

  const handleInvalid = useCallback((fieldErrors: FieldErrors<TagFormValues>) => {
    const enHasError = !!fieldErrors.nameEn;
    const ukHasError = !!(fieldErrors.name || fieldErrors.slug);
    if (enHasError && !ukHasError) setLangTab('en');
    else if (ukHasError) setLangTab('uk');
  }, []);

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
        setError('slug', { message: t('admin.tag.slugTaken') });
        setLangTab('uk');
      } else if (message.includes('Name') || message.includes('name')) {
        setError('name', { message: t('admin.tag.nameTaken') });
        setLangTab('uk');
      }
    }
  }, handleInvalid);

  const isSubmitting = createTag.isPending || updateTag.isPending;

  return (
    <div className={s.page}>
      <div className={s.formCard}>
        <div className="flex items-center justify-between">
          <h2 className={s.formTitle}>
            {editingId ? t('admin.tag.edit') : t('admin.tag.new')}
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
                label={t('admin.tag.name')}
                placeholder={t('admin.tag.namePlaceholder')}
                hint={t('admin.tag.nameHint')}
                error={errors.name?.message}
                {...register('name')}
              />
              <TextField
                label={t('admin.tag.slug')}
                placeholder={t('admin.tag.slugPlaceholder')}
                hint={t('admin.tag.slugHint')}
                error={errors.slug?.message}
                {...register('slug')}
              />
              <div className={s.colorSection}>
                <label className={s.colorLabel}>{t('admin.tag.color')}</label>
                <div className={s.swatches}>
                  {colorSwatches}
                </div>
                <p className={s.colorHint}>{t('admin.tag.colorHint')}</p>
              </div>
            </div>
          </When>

          <When condition={langTab === 'en'}>
            <TextField
              label={t('admin.tag.nameEn')}
              placeholder={t('admin.tag.namePlaceholder')}
              hint={t('admin.tag.nameEnHint')}
              error={errors.nameEn?.message}
              {...register('nameEn')}
            />
          </When>

          <When condition={!!editingId && (editingTag?._count?.products ?? 0) > 0}>
            <div className={s.editWarning}>
              <Info className={s.editWarningIcon} />
              {t('admin.tag.editWarningBefore')} {editingTag?._count?.products} {t('admin.tag.editWarningAfter')}
            </div>
          </When>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              <If condition={isSubmitting}>
                <Then><Spinner size="sm" /><span className="ml-2">{editingId ? t('admin.tag.saving') : t('admin.tag.creating')}</span></Then>
                <Else>{editingId ? t('admin.tag.save') : t('admin.tag.create')}</Else>
              </If>
            </Button>
            <When condition={!!editingId}>
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                {t('admin.tag.cancel')}
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
                  <th className={s.th}>{t('admin.tag.tableTitle')}</th>
                  <th className={s.thCenter}>{t('admin.tag.tableProducts')}</th>
                  <th className={s.thCenter}>{t('admin.tag.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                <If condition={tags.length > 0}>
                  <Then>
                    {tags.map((tag) => (
                      <TagRow
                        key={tag.id}
                        tag={tag}
                        canDelete={isAdmin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </Then>
                  <Else>
                    <tr>
                      <td colSpan={3} className={s.emptyRow}>
                        {t('admin.tag.noItems')}
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
        title={t('admin.tag.confirmDeleteTitle')}
        isLoading={deleteTag.isPending}
        description={
          <>
            {t('admin.tag.confirmDeletePrefix')} <strong>«{pendingDelete?.name}»</strong> {t('admin.tag.confirmDeleteSuffix')}{' '}
            <When condition={(pendingDelete?._count?.products ?? 0) > 0}>
              {t('admin.tag.confirmDeleteProductsBefore')} {pendingDelete?._count?.products} {t('admin.tag.confirmDeleteProductsAfter')}
            </When>
          </>
        }
      />
    </div>
  );
};

export default TagsPage;
