import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(80),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const createPostSchema = z.object({
  body: z.string().min(1).max(5000)
});

export const createCommentSchema = z.object({
  body: z.string().min(1).max(1000)
});
