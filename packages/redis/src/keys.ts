export const redisKeys = {
  notificationCount: (userId: string) => `notifications:${userId}:count`,
};
