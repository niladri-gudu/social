import { Redis } from "ioredis";
import { env } from "@repo/config";

export const createRedisConnection = () =>
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });

export const redis = createRedisConnection();
export const publisher = createRedisConnection();
export const subscriber = createRedisConnection();

export * from "./keys.js";
