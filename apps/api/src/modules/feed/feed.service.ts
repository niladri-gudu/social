import { prisma } from "@repo/db";

import type { FeedQuery } from "./feed.schema.js";

import type { FeedItem, FeedResponse } from "./feed.types.js";

export class FeedService {
  static async getFeed(
    userId: string,
    query: FeedQuery,
  ): Promise<FeedResponse> {
    const { limit, cursor } = query;

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return {
        items: [],
        nextCursor: null,
      };
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: followingIds,
        },
      },

      take: limit + 1,

      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),

      orderBy: {
        createdAt: "desc",
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

    let nextCursor: string | null = null;

    if (posts.length > limit) {
      const nextPost = posts.pop();

      nextCursor = nextPost?.id ?? null;
    }

    const items: FeedItem[] = posts.map((post) => ({
      id: post.id,
      content: post.content,

      createdAt: post.createdAt,

      author: {
        id: post.author.id,
        username: post.author.username,
        avatarUrl: post.author.avatarUrl ?? "",
      },

      likesCount: post._count.likes,

      commentsCount: post._count.comments,
    }));

    return {
      items,
      nextCursor,
    };
  }
}
