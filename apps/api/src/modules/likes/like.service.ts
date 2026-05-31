import { prisma } from "@repo/db";
import { NotificationService } from "../notifications/notification.service.js";

export class LikeService {
  static async likePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      throw new Error("Post already liked");
    }

    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    if (post.authorId !== userId) {
      await NotificationService.createLikeNotification(
        userId,
        post.authorId,
        postId,
      );
    }

    return {
      success: true,
    };
  }

  static async unlikePost(userId: string, postId: string) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return {
      success: true,
    };
  }

  static async getPostLikes(postId: string) {
    return prisma.like.findMany({
      where: {
        postId,
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  static async getLikeCount(postId: string) {
    const count = await prisma.like.count({
      where: {
        postId,
      },
    });

    return {
      likes: count,
    };
  }

  static async hasLiked(userId: string, postId: string) {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return {
      liked: !!like,
    };
  }
}
