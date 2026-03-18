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

interface PromotionValidationMessages {
  required: string;
  slugRequired: string;
  slugFormat: string;
  descriptionMin: string;
  descriptionMax: string;
  bannerRequired: string;
  startDateRequired: string;
  endDateRequired: string;
  discountRequired: string;
  discountPositive: string;
  positionInvalid: string;
}

export const buildPromotionFormSchema = (msg: PromotionValidationMessages) =>
  z.object({
    title: z.string().min(1, msg.required).max(200),
    titleEn: z.string().min(1, msg.required).max(200),
    slug: z.string().min(1, msg.slugRequired).regex(/^[a-z0-9-]+$/, msg.slugFormat),
    description: z.string().max(500, msg.descriptionMax).refine((v) => v.length === 0 || v.length >= 10, msg.descriptionMin),
    descriptionEn: z.string().max(500, msg.descriptionMax).refine((v) => v.length === 0 || v.length >= 10, msg.descriptionMin),
    bannerImageUrl: z.string().min(1, msg.bannerRequired),
    bannerBgColor: z.string(),
    startDate: z.string().min(1, msg.startDateRequired),
    endDate: z.string().min(1, msg.endDateRequired),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.string().min(1, msg.discountRequired).refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      msg.discountPositive,
    ),
    isActive: z.boolean(),
    position: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, msg.positionInvalid),
    link: z.string(),
    productIds: z.array(z.string()),
  });

export type CreatePromotionFormValues = z.infer<ReturnType<typeof buildPromotionFormSchema>>;

