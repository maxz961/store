import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Region is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().length(2, "Use 2-letter country code (e.g. US, RU)"),
});

export const createOrderSchema = z.object({
  deliveryMethod: z.enum(["COURIER", "PICKUP", "POST"]),
  shippingAddress: shippingAddressSchema,
  items: z
    .array(
      z.object({
        productId: z.string().cuid("Invalid product ID"),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .min(1, "Order must have at least one item"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;
