import { prisma } from "@repo/db";
import { notificationQueue } from "@repo/queues";
import { redis, redisKeys } from "@repo/redis";

export class AdminService {
  static async getFailedJobs() {
    return prisma.failedJob.findMany({
      where: {
        status: "FAILED",
      },
      orderBy: {
        failedAt: "desc",
      },
    });
  }

  static async replayFailedJob(failedJobId: string) {
    const failedJob = await prisma.failedJob.findUnique({
      where: {
        id: failedJobId,
      },
    });

    if (!failedJob) {
      throw new Error("Failed job not found");
    }

    await notificationQueue.add("replayed-notification", failedJob.payload);

    await prisma.failedJob.update({
      where: {
        id: failedJob.id,
      },
      data: {
        status: "REPLAYED",
        replayedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Job replayed successfully",
    };
  }

  static async getReplayedJobs() {
    return prisma.failedJob.findMany({
      where: {
        status: "REPLAYED",
      },
      orderBy: {
        replayedAt: "desc",
      },
    });
  }

  static async getDLQMetrics() {
    const failedCount = await prisma.failedJob.count({
      where: {
        status: "FAILED",
      },
    });

    const replayedCount = await prisma.failedJob.count({
      where: {
        status: "REPLAYED",
      },
    });

    const total = failedCount + replayedCount;

    const recoveryRate =
      total === 0 ? 0 : Number(((replayedCount / total) * 100).toFixed(2));

    return {
      failedCount,
      replayedCount,
      totalJobs: total,
      recoveryRate,
    };
  }

  static async getQueueMetrics() {
    const counts = await notificationQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
      "paused",
    );

    return {
      queue: "notifications",
      ...counts,
      timestamp: new Date().toISOString(),
    };
  }

  static async getWorkerMetrics() {
    const processed =
      Number(await redis.get(redisKeys.workerProcessedJobs)) || 0;

    const failed = Number(await redis.get(redisKeys.workerFailedJobs)) || 0;

    const total = processed + failed;

    const successRate =
      total === 0 ? 0 : Number(((processed / total) * 100).toFixed(2));

    return {
      processed,
      failed,
      total,
      successRate,
    };
  }
}
