import { z } from 'zod';


export const breadcrumbs = [
  { label: 'Admin', href: '/admin/dashboard' },
  { label: 'Promotions', href: '/admin/promotions' },
  { label: 'New promotion' },
];

export const generateSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const DEFAULT_BANNER_BG_COLOR = '#e8f5e9';

export const BANNER_BG_PRESET_COLORS = [
  '#e8f5e9', // soft green
  '#e3f2fd', // soft blue
  '#f3e5f5', // soft purple
  '#fce4ec', // soft pink
  '#fff8e1', // soft amber
  '#e0f2f1', // soft teal
  '#f1f5f9', // light gray
  '#fef3c7', // soft yellow
  '#4361ee', // primary indigo
  '#1e293b', // dark slate
];

export const DISCOUNT_TYPE_OPTIONS = [
  { value: 'PERCENTAGE', label: 'Percentage (%)' },
  { value: 'FIXED', label: 'Fixed ($)' },
];

export const createPromotionFormSchema = z.object({
  title: z.string().min(1, 'Required').max(200),
  titleEn: z.string().min(1, 'Required').max(200),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, digits and dashes only'),
  description: z.string(),
  descriptionEn: z.string(),
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
  banner: 'Banner is displayed in the carousel on the catalog home page. Recommended image size: 1200×400 px.',
  title: 'Promotion title — shown on the banner in the catalog and in the admin panel list.',
  slug: 'Unique identifier for the promotion in the URL. Generated automatically from the title.',
  description: 'Short promotion description — shown on the banner below the title.',
  bannerImageUrl: 'Banner image URL. Recommended size: 800x300 px.',
  bannerBgColor: 'Banner background color in HEX format (e.g. #e8f5e9). Soft pastel tones look best.',
  startDate: 'Promotion start date. The banner will appear in the catalog from this date.',
  endDate: 'Promotion end date. After this date the banner will be hidden automatically.',
  discountType: 'Discount type: percentage of price or fixed amount.',
  discountValue: 'Discount amount. For percentage: 25 = 25%. For fixed: 50 = $50.',
  position: 'Display order in the carousel. 0 = first, 1 = second, etc.',
  link: 'Link for the "Learn more" button on the banner. Example: /products?tagSlugs=sale',
  products: 'Products participating in the promotion. Select from the list.',
} as const;
