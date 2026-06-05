export const redisKeys = {
  notificationCount: (userId: string) => `notifications:${userId}:count`,
  presenceOnline: (userId: string) => `presence:${userId}:online`,
  presenceLastSeen: (userId: string) => `presence:${userId}:lastSeen`,
  workerProcessedJobs: "metrics:jobs:processed",
  workerFailedJobs: "metrics:jobs:failed",
};
