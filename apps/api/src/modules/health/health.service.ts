import { prisma } from "@repo/db";
import { redis } from "@repo/redis";

export class HealthService {
  static async checkHealth() {
    const services = {
      api: "healthy",
      database: "unhealthy",
      redis: "unhealthy",
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      services.database = "healthy";
    } catch {}

    try {
      await redis.ping();
      services.redis = "healthy";
    } catch {}

    const allHealthy = Object.values(services).every(
      (status) => status === "healthy",
    );

    return {
      status: allHealthy ? "healthy" : "degraded",
      services,
      timestamp: new Date().toISOString(),
    };
  }
}
