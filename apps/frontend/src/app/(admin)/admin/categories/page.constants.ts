import { z } from 'zod';


interface CategoryValidationMessages {
  required: string;
  nameMax: string;
  slugFormat: string;
}

export const buildCategoryFormSchema = (msg: CategoryValidationMessages) =>
  z.object({
    name: z.string().min(1, msg.required).max(100, msg.nameMax),
    nameEn: z.string().min(1, msg.required).max(100, msg.nameMax),
    slug: z.string().min(1, msg.required).max(100, msg.nameMax).regex(/^[a-z0-9-]+$/, msg.slugFormat),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
  });

export type CategoryFormValues = z.infer<ReturnType<typeof buildCategoryFormSchema>>;

export const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
