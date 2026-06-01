import { prisma } from "@repo/db";

export class NotificationService {
  static async createFollowNotification(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      return;
    }

    return prisma.notification.create({
      data: {
        type: "FOLLOW",
        senderId,
        receiverId,
      },
    });
  }

  static async createLikeNotification(
    senderId: string,
    receiverId: string,
    postId: string,
  ) {
    if (senderId === receiverId) {
      return;
    }

    return prisma.notification.create({
      data: {
        type: "LIKE",
        senderId,
        receiverId,
        postId,
      },
    });
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

    return prisma.notification.create({
      data: {
        type: "COMMENT",
        senderId,
        receiverId,
        postId,
        commentId,
      },
    });
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
    const count = await prisma.notification.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

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

    return prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
