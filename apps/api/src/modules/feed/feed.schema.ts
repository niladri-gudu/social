import { z } from "zod";

export const feedQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),

  cursor: z.string().optional(),
});

export type FeedQuery = z.infer<typeof feedQuerySchema>;
