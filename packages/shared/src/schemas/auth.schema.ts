import { z } from "zod";

export const googleUserSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().url().optional(),
});

export type GoogleUser = z.infer<typeof googleUserSchema>;
