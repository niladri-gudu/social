import { prisma } from "@repo/db";
import { redis, redisKeys } from "@repo/redis";

export class NotificationService {
  static async createFollowNotification(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      return;
    }

    const notification = await prisma.notification.create({
      data: {
        type: "FOLLOW",
        senderId,
        receiverId,
      },
    });

    console.log("NOTIFICATION CREATED");

    await redis.incr(redisKeys.notificationCount(receiverId));

    console.log("REDIS INCR", redisKeys.notificationCount(receiverId));
    
    return notification;
  }

  static async createLikeNotification(
    senderId: string,
    receiverId: string,
    postId: string,
  ) {
    if (senderId === receiverId) {
      return;
    }

    const notification = await prisma.notification.create({
      data: {
        type: "LIKE",
        senderId,
        receiverId,
        postId,
      },
    });

    await redis.incr(redisKeys.notificationCount(receiverId));

    return notification;
  }

  static async createCommentNotification(
    senderId: string,
    receiverId: string,
    postId: string,
    commentId: string,
  ) {
    if (senderId === receiverId) {
      return;
    }

    const notification = await prisma.notification.create({
      data: {
        type: "COMMENT",
        senderId,
        receiverId,
        postId,
        commentId,
      },
    });

    await redis.incr(redisKeys.notificationCount(receiverId));

    return notification;
  }

  static async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getUnreadCount(userId: string) {
    const cached = await redis.get(redisKeys.notificationCount(userId));

    if (cached !== null) {
      return {
        count: Number(cached),
      };
    }

    const count = await prisma.notification.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    await redis.set(redisKeys.notificationCount(userId), count);

    return {
      count,
    };
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.receiverId !== userId) {
      throw new Error("Unauthorized");
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    await redis.decr(redisKeys.notificationCount(userId));

    return updatedNotification;
  }

  static async markAllAsRead(userId: string) {
    const updatedNotifications = await prisma.notification.updateMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    await redis.set(redisKeys.notificationCount(userId), 0);

    return updatedNotifications;
  }
}
