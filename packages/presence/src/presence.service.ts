import { redis, redisKeys } from "@repo/redis";

export class PresenceService {
  static async markOnline(userId: string) {
    await redis.set(redisKeys.presenceOnline(userId), "true");
  }

  static async markOffline(userId: string) {
    await redis.del(redisKeys.presenceOnline(userId));
    await redis.set(redisKeys.presenceLastSeen(userId), Date.now().toString());
  }

  static async getPresence(userId: string) {
    const online = await redis.get(redisKeys.presenceOnline(userId));

    const lastSeen = await redis.get(redisKeys.presenceLastSeen(userId));

    return {
      online: online === "true",
      lastSeen: lastSeen ? new Date(Number(lastSeen)) : null,
    };
  }
}
