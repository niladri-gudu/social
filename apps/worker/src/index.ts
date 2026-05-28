import { Worker, QueueEvents } from "bullmq";
import { PubSubChannel, QueueName, notificationJobSchema } from "@repo/events";
import { createRedisConnection, publisher } from "@repo/redis";

const connection = createRedisConnection();

const worker = new Worker(
  QueueName.Notifications,
  async (job) => {
    const payload = notificationJobSchema.parse(job.data);
    await publisher.publish(PubSubChannel.Notifications, JSON.stringify(payload));
    return { deliveredToPubSub: true };
  },
  {
    connection,
    concurrency: 10
  }
);

const events = new QueueEvents(QueueName.Notifications, {
  connection: createRedisConnection()
});

worker.on("completed", (job) => {
  console.log(`notification job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`notification job ${job?.id} failed`, error);
});

events.on("failed", ({ jobId, failedReason }) => {
  console.error(`notification job ${jobId} moved to failed state: ${failedReason}`);
});

console.log("notification worker is running");
