import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  sku: z.string().optional(),
  categoryId: z.string().cuid("Invalid category ID"),
  isPublished: z.boolean().default(false),
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
  tagIds: z.array(z.string().cuid()).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
