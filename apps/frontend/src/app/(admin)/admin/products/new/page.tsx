'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { When } from 'react-if';
import { api } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { s } from './page.styled';


interface CategoryOption {
  id: string;
  name: string;
}

interface TagOption {
  id: string;
  name: string;
}

const breadcrumbs = [
  { label: 'Админ-панель', href: '/admin/dashboard' },
  { label: 'Товары', href: '/admin/products' },
  { label: 'Новый товар' },
];

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const NewProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    Promise.all([
      api.get<CategoryOption[]>('/categories'),
      api.get<TagOption[]>('/tags'),
    ]).then(([cats, tgs]) => {
      setCategories(cats);
      setTags(tgs);
    });
  }, []);

  const handleNameInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: generateSlug(name) }));
  }, []);

  const handleFormField = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value })),
    [],
  );

  const handlePublishedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, isPublished: e.target.checked })),
  []);

  const handleToggleTag = useCallback((id: string) => () => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/products', {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        stock: parseInt(form.stock),
        images: form.images.split(',').map((u) => u.trim()).filter(Boolean),
        tagIds: selectedTags,
      });
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать товар');
    } finally {
      setLoading(false);
    }
  }, [form, selectedTags, router]);

  const basicInfoCard = (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Основная информация</h2>

      <div className={s.fieldGroup}>
        <label className={s.label}>Название товара</label>
        <input
          required
          value={form.name}
          onChange={handleNameInput}
          placeholder="Например: Беспроводные наушники"
          className={s.input}
        />
      </div>

      <div className={s.fieldGroup}>
        <label className={s.label}>Slug</label>
        <input
          required
          value={form.slug}
          onChange={handleFormField('slug')}
          className={s.slugInput}
        />
        <p className={s.hint}>Генерируется автоматически из названия</p>
      </div>

      <div className={s.fieldGroup}>
        <label className={s.label}>Описание</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={handleFormField('description')}
          placeholder="Подробное описание товара..."
          className={s.textarea}
        />
      </div>
    </div>
  );

  const pricingCard = (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Цена и склад</h2>

      <div className={s.grid2}>
        <div className={s.fieldGroup}>
          <label className={s.label}>Цена (₴)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleFormField('price')}
            placeholder="0.00"
            className={s.input}
          />
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>Старая цена (₴)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.comparePrice}
            onChange={handleFormField('comparePrice')}
            placeholder="Необязательно"
            className={s.input}
          />
        </div>
      </div>

      <div className={s.grid2}>
        <div className={s.fieldGroup}>
          <label className={s.label}>Остаток на складе</label>
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={handleFormField('stock')}
            className={s.input}
          />
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>SKU</label>
          <input
            value={form.sku}
            onChange={handleFormField('sku')}
            placeholder="Необязательно"
            className={s.input}
          />
        </div>
      </div>
    </div>
  );

  const categoryAndTagsCard = (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Категория и теги</h2>

      <div className={s.fieldGroup}>
        <label className={s.label}>Категория</label>
        <select
          required
          value={form.categoryId}
          onChange={handleFormField('categoryId')}
          className={s.select}
        >
          <option value="">Выберите категорию</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <When condition={tags.length > 0}>
        <div>
          <p className={s.tagsTitle}>Теги</p>
          <div className={s.tagsWrapper}>
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={handleToggleTag(tag.id)}
                className={cn(
                  s.tagBtn,
                  selectedTags.includes(tag.id) ? s.tagBtnActive : s.tagBtnInactive,
                )}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </When>
    </div>
  );

  const imagesCard = (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Изображения</h2>

      <div className={s.fieldGroup}>
        <label className={s.label}>URL изображений</label>
        <input
          required
          value={form.images}
          onChange={handleFormField('images')}
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          className={s.input}
        />
        <p className={s.hint}>Несколько URL через запятую</p>
      </div>
    </div>
  );

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <h1 className={`${s.title} mt-6`}>Новый товар</h1>

      <form onSubmit={handleSubmit} className={s.form}>
        {basicInfoCard}
        {pricingCard}
        {categoryAndTagsCard}
        {imagesCard}

        <label className={s.checkboxLabel}>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={handlePublishedChange}
            className={s.checkbox}
          />
          Опубликовать сразу
        </label>

        <When condition={!!error}>
          <div className={s.error}>{error}</div>
        </When>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Создание...' : 'Создать товар'}
        </Button>
      </form>
    </div>
  );
};

export default NewProductPage;
