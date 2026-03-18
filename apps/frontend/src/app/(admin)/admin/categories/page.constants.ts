import { z } from 'zod';


export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Required').max(100, 'Max 100 characters'),
  nameEn: z.string().min(1, 'Required').max(100, 'Max 100 characters'),
  slug: z.string().min(1, 'Required').max(100, 'Max 100 characters').regex(/^[a-z0-9-]+$/, 'Lowercase letters, digits and hyphens only'),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
