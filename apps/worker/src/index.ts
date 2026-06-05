import { Worker, QueueEvents } from "bullmq";
import { PubSubChannel, QueueName, notificationJobSchema } from "@repo/events";
import { createRedisConnection, publisher } from "@repo/redis";
import { NotificationService } from "@repo/notifications";
import { realtimeNotificationSchema } from "@repo/events";
import { prisma } from "@repo/db";
import { redis, redisKeys } from "@repo/redis";

const connection = createRedisConnection();

const worker = new Worker(
  QueueName.Notifications,
  async (job) => {
    const payload = notificationJobSchema.parse(job.data);

    switch (payload.type) {
      case "FOLLOW":
        await NotificationService.createFollowNotification(
          payload.actorId,
          payload.recipientId,
        );
        break;

      case "LIKE":
        await NotificationService.createLikeNotification(
          payload.actorId,
          payload.recipientId,
          payload.postId!,
        );
        break;

      case "COMMENT":
        await NotificationService.createCommentNotification(
          payload.actorId,
          payload.recipientId,
          payload.postId!,
          payload.commentId!,
        );
        break;
    }

    const unreadCount = await NotificationService.getCachedUnreadCount(
      payload.recipientId,
    );

    const realtimeEvent = realtimeNotificationSchema.parse({
      type: "NOTIFICATION_CREATED",
      notification: payload,
      unreadCount,
    });

    await publisher.publish(
      PubSubChannel.Notifications,
      JSON.stringify(realtimeEvent),
    );

    return { deliveredToPubSub: true };
  },
  {
    connection,
    concurrency: 10,
  },
);

const events = new QueueEvents(QueueName.Notifications, {
  connection: createRedisConnection(),
});

worker.on("completed", async (job) => {
  await redis.incr(redisKeys.workerProcessedJobs);

  console.log(`notification job ${job.id} completed`);
});

worker.on("failed", async (job, error) => {
  if (job && job.attemptsMade >= (job.opts.attempts ?? 0)) {
    await prisma.failedJob.create({
      data: {
        queueName: QueueName.Notifications,
        originalJobId: String(job.id),
        payload: job.data,
        error: error.message,
        failedAt: new Date(),
        status: "FAILED",
      },
    });
  }

  console.error(`notification job ${job?.id} failed`, error);
});

events.on("failed", async ({ jobId, failedReason }) => {
  await redis.incr(redisKeys.workerFailedJobs);

  console.error(
    `notification job ${jobId} moved to failed state: ${failedReason}`,
  );
});

console.log("notification worker is running");
