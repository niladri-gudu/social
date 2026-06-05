import { Queue } from "bullmq";

import { QueueName } from "@repo/events";
import { createRedisConnection } from "@repo/redis";

export const notificationQueue = new Queue(QueueName.Notifications, {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 1000,
    },

    removeOnComplete: 1000,
    removeOnFail: 1000,
  },
});
