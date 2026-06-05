import { prisma } from "@repo/db";
import { notificationQueue } from "@repo/queues";

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
}
