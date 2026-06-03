import { prisma } from "@repo/db";

import type { CreateCommentInput } from "./comment.schema.js";
import { notificationQueue } from "@repo/queues";

export class CommentService {
  static async createComment(
    userId: string,
    postId: string,
    data: CreateCommentInput,
  ) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        authorId: userId,
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (post.authorId !== userId) {
      await notificationQueue.add("comment-notification", {
        actorId: userId,
        recipientId: post.authorId,
        type: "COMMENT",
        postId,
        commentId: comment.id,
      });
    }

    return comment;
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return {
      success: true,
    };
  }

  static async getPostComments(postId: string) {
    return prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getComment(commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    return comment;
  }
}
