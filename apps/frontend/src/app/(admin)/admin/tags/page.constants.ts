import { z } from 'zod';


export const tagFormSchema = z.object({
  name: z.string().min(1, 'Required').max(100, 'Max 100 characters'),
  nameEn: z.string().min(1, 'Required').max(100, 'Max 100 characters'),
  slug: z.string().min(1, 'Required').max(100, 'Max 100 characters').regex(/^[a-z0-9-]+$/, 'Lowercase letters, digits and hyphens only'),
  color: z.string().optional(),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;

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

export const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
