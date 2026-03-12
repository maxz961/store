import { z } from 'zod';


export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Введите название').max(100, 'Максимум 100 символов'),
  slug: z.string().min(1, 'Введите slug').max(100, 'Максимум 100 символов').regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
