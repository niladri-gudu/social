import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { config } from "dotenv";
import { z } from "zod";

const findEnvFile = (startDir: string) => {
  let currentDir = startDir;

  while (true) {
    const candidate = join(currentDir, ".env");
    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return undefined;
    }

    currentDir = parentDir;
  }
};

config({ path: findEnvFile(process.cwd()) });

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEBSOCKET_PORT: z.coerce.number().int().positive().default(4001),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development")
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
