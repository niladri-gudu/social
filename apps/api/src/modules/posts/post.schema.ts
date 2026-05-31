import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be less than 500 characters"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
