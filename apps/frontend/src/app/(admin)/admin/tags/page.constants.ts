import { z } from 'zod';


interface TagValidationMessages {
  required: string;
  nameMax: string;
  slugFormat: string;
}

export const buildTagFormSchema = (msg: TagValidationMessages) =>
  z.object({
    name: z.string().min(1, msg.required).max(100, msg.nameMax),
    nameEn: z.string().min(1, msg.required).max(100, msg.nameMax),
    slug: z.string().min(1, msg.required).max(100, msg.nameMax).regex(/^[a-z0-9-]+$/, msg.slugFormat),
    color: z.string().optional(),
  });

export type TagFormValues = z.infer<ReturnType<typeof buildTagFormSchema>>;

export const DEFAULT_TAG_COLOR = '#4361ee';

export const TAG_PRESET_COLORS = [
  '#4361ee', // primary — indigo
  '#6366f1', // violet
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#ef4444', // red
  '#f59e0b', // amber
  '#22c55e', // green
  '#14b8a6', // teal
  '#0ea5e9', // sky
  '#6b7280', // gray
];

export const sanitizeSlugInput = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const generateSlug = (name: string) => sanitizeSlugInput(name);
