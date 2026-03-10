import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Минимальная оценка — 1').max(5, 'Максимальная оценка — 5'),
  comment: z.string().max(2000, 'Максимум 2000 символов').optional(),
  images: z.array(z.string().url()).max(5, 'Максимум 5 фото').default([]),
});

export const updateReviewSchema = createReviewSchema.partial();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
