import { z } from 'zod';


export const breadcrumbs = [
  { label: 'Админ-панель', href: '/admin/dashboard' },
  { label: 'Товары', href: '/admin/products' },
  { label: 'Новый товар' },
];

export const generateSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const createProductFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1, 'Slug обязателен').regex(/^[a-z0-9-]+$/, 'Только строчные буквы, цифры и дефисы'),
  description: z.string().min(1, 'Описание обязательно'),
  price: z.string().min(1, 'Укажите цену').refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Цена должна быть больше 0'),
  comparePrice: z.string(),
  stock: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, 'Остаток не может быть отрицательным'),
  sku: z.string(),
  categoryId: z.string().min(1, 'Выберите категорию'),
  isPublished: z.boolean(),
  images: z.string().min(1, 'Добавьте URL изображений'),
  tagIds: z.array(z.string()),
});

export type CreateProductFormValues = z.infer<typeof createProductFormSchema>;
