import { z } from 'zod';


export const breadcrumbs = [
  { label: 'Адмін-панель', href: '/admin/dashboard' },
  { label: 'Товари', href: '/admin/products' },
  { label: 'Новий товар' },
];

export const generateSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

type ValidationMessages = {
  required: string;
  nameMax: string;
  slugFormat: string;
  descriptionMin: string;
  pricePositive: string;
  stockWhole: string;
  categoryRequired: string;
  imageUrlsInvalid: string;
};

export const buildProductFormSchema = (msg: ValidationMessages) => z.object({
  name: z.string().min(1, msg.required).max(200, msg.nameMax),
  nameEn: z.string().min(1, msg.required).max(200, msg.nameMax),
  slug: z.string().min(1, msg.required).max(200, msg.nameMax).regex(/^[a-z0-9-]+$/, msg.slugFormat),
  description: z.string().min(10, msg.descriptionMin),
  descriptionEn: z.string().min(10, msg.descriptionMin),
  price: z.string().min(1, msg.required).refine((v) => !isNaN(Number(v)) && Number(v) > 0, msg.pricePositive),
  comparePrice: z.string(),
  stock: z.string().refine((v) => v.trim() !== '' && !isNaN(Number(v)) && Number.isInteger(Number(v)) && Number(v) >= 0, msg.stockWhole),
  sku: z.string(),
  categoryId: z.string().min(1, msg.categoryRequired),
  isPublished: z.boolean(),
  imageUrls: z.string().refine((v) => {
    if (!v.trim()) return true;
    return v.split(',').map((u) => u.trim()).filter(Boolean).every((url) => {
      try { new URL(url); return true; } catch { return false; }
    });
  }, msg.imageUrlsInvalid),
  tagIds: z.array(z.string()),
});

// Static schema used for type inference only — messages don't affect the type shape
const _schemaForType = buildProductFormSchema({
  required: '',
  nameMax: '',
  slugFormat: '',
  descriptionMin: '',
  pricePositive: '',
  stockWhole: '',
  categoryRequired: '',
  imageUrlsInvalid: '',
});

export type CreateProductFormValues = z.infer<typeof _schemaForType>;

