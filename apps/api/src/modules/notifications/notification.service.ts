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
}
