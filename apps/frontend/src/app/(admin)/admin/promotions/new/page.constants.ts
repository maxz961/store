import { z } from 'zod';


export const breadcrumbs = [
  { label: 'Админ-панель', href: '/admin/dashboard' },
  { label: 'Акции', href: '/admin/promotions' },
  { label: 'Новая акция' },
];

export const generateSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const DISCOUNT_TYPE_OPTIONS = [
  { value: 'PERCENTAGE', label: 'Процент (%)' },
  { value: 'FIXED', label: 'Фиксированная ($)' },
];

export const createPromotionFormSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1, 'Slug обязателен').regex(/^[a-z0-9-]+$/, 'Только строчные буквы, цифры и дефисы'),
  description: z.string(),
  bannerImageUrl: z.string().min(1, 'URL баннера обязателен'),
  bannerBgColor: z.string(),
  startDate: z.string().min(1, 'Дата начала обязательна'),
  endDate: z.string().min(1, 'Дата окончания обязательна'),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.string().min(1, 'Укажите размер скидки').refine(
    (v) => !isNaN(Number(v)) && Number(v) > 0,
    'Скидка должна быть больше 0',
  ),
  isActive: z.boolean(),
  position: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, 'Позиция не может быть отрицательной'),
  link: z.string(),
  productIds: z.array(z.string()),
});

export type CreatePromotionFormValues = z.infer<typeof createPromotionFormSchema>;

export const FIELD_TOOLTIPS = {
  title: 'Название акции — отображается на баннере в каталоге и в списке админ-панели.',
  slug: 'Уникальный идентификатор акции в URL. Генерируется автоматически из названия.',
  description: 'Краткое описание акции — отображается на баннере под заголовком.',
  bannerImageUrl: 'URL изображения для баннера. Рекомендуемый размер: 800x300 px.',
  bannerBgColor: 'Цвет фона баннера в HEX формате (например: #e8f5e9). Мягкие пастельные тона выглядят лучше.',
  startDate: 'Дата начала акции. Баннер появится в каталоге с этой даты.',
  endDate: 'Дата окончания акции. После этой даты баннер автоматически скроется.',
  discountType: 'Тип скидки: процент от цены или фиксированная сумма.',
  discountValue: 'Размер скидки. Для процента: 25 = 25%. Для фиксированной: 50 = $50.',
  position: 'Порядок отображения в карусели. 0 = первый, 1 = второй и т.д.',
  link: 'Ссылка для кнопки «Подробнее» на баннере. Например: /products?tagSlugs=sale',
  products: 'Товары, участвующие в акции. Выберите из списка.',
} as const;
