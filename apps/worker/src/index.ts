import { Worker, QueueEvents } from "bullmq";
import { PubSubChannel, QueueName, notificationJobSchema } from "@repo/events";
import { createRedisConnection, publisher } from "@repo/redis";
import { NotificationService } from "@repo/notifications";

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

    await publisher.publish(
      PubSubChannel.Notifications,
      JSON.stringify(payload),
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

worker.on("completed", (job) => {
  console.log(`notification job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`notification job ${job?.id} failed`, error);
});

events.on("failed", ({ jobId, failedReason }) => {
  console.error(
    `notification job ${jobId} moved to failed state: ${failedReason}`,
  );
});

console.log("notification worker is running");
