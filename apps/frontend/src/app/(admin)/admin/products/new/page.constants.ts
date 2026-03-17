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

export const FIELD_TOOLTIPS = {
  name: 'Product name displayed in the catalog and on the product page. Use a clear, descriptive name.',
  nameEn: 'Product name in English — displayed when the user switches to English.',
  slug: 'Unique product identifier in the URL. Generated automatically from the name. Can be edited manually — lowercase letters, digits and hyphens only.',
  description: 'Detailed product description: features, materials, dimensions, contents. Shown on the product page.',
  descriptionEn: 'Product description in English — shown when the user switches to English.',
  price: 'Current selling price in UAH. Must be greater than 0.',
  comparePrice: 'Old price before discount. If set — a strikethrough old price will appear next to the current price.',
  stock: 'Quantity in stock. Decreases when an order is placed. Items with stock < 10 appear in the low-stock warning on analytics.',
  sku: 'Internal SKU for warehouse tracking. Optional. Only visible in the admin panel.',
  categoryId: 'Category determines which section of the catalog the product appears in. Each product can be in one category only.',
  tags: 'Tags are additional labels for filtering products. Unlike categories, a product can have multiple tags.',
  images: 'Product images. The first image becomes the main (cover) image. Upload quality photos or provide a URL.',
  isPublished: 'If enabled — the product immediately appears in the catalog. If disabled — saved as a draft visible only in the admin panel.',
} as const;
