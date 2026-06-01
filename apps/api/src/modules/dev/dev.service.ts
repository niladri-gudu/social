import { prisma } from "@repo/db";

import { NotificationService } from "../notifications/notification.service.js";

export class DevService {
  static async generateNotifications(count: number = 10) {
    const users = await prisma.user.findMany({
      take: 2,
    });

    const sender = users[0];
    const receiver = users[1];

    if (!sender || !receiver) {
      throw new Error("Need at least 2 users");
    }

    for (let i = 0; i < count; i++) {
      await NotificationService.createFollowNotification(
        sender.id,
        receiver.id,
      );
    }

    return {
      success: true,
      created: count,
    };
  }

  static async generateActivity() {
    const users = await prisma.user.findMany();

    if (users.length < 2) {
      throw new Error("Need at least 2 users");
    }

    const sender = users[0];
    const receiver = users[1];

    const post = await prisma.post.findFirst({
      where: {
        authorId: receiver.id,
      },
    });

    if (!post) {
      throw new Error("No post found for receiver");
    }

    await NotificationService.createFollowNotification(sender.id, receiver.id);

    await NotificationService.createLikeNotification(
      sender.id,
      receiver.id,
      post.id,
    );

    const comment = await prisma.comment.create({
      data: {
        content: "Generated comment",
        authorId: sender.id,
        postId: post.id,
      },
    });

    await NotificationService.createCommentNotification(
      sender.id,
      receiver.id,
      post.id,
      comment.id,
    );

    return {
      success: true,
      message: "Follow, Like and Comment notifications generated",
    };
  }
}
