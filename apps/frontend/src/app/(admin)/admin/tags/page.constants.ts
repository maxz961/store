import { z } from 'zod';


export const tagFormSchema = z.object({
  name: z.string().min(1, 'Введите название'),
  slug: z.string().min(1, 'Введите slug').regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
  color: z.string().optional(),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;

export const DEFAULT_TAG_COLOR = '#4361ee';

export const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
