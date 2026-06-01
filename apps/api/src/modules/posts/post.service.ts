import { prisma } from "@repo/db";

import type { CreatePostInput } from "./post.schema.js";

export class PostService {
  static async createPost(authorId: string, input: CreatePostInput) {
    return prisma.post.create({
      data: {
        authorId,
        content: input.content,
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
  }

  static async getPost(postId: string) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  }

  static async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return {
      success: true,
    };
  }

  static async getUserPosts(userId: string) {
    return prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
