import { prisma } from "@repo/db";

export class FollowService {
  static async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error("You cannot follow yourself.");
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      throw new Error("You are already following this user.");
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    await prisma.notification.create({
      data: {
        type: "FOLLOW",
        senderId: followerId,
        receiverId: followingId,
      },
    });

    return {
      success: true,
    };
  }

  static async unfollowUser(followerId: string, followingId: string) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return {
      success: true,
    };
  }

  static async getFollowers(userId: string) {
    return prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  static async getFollowing(userId: string) {
    return prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  static async getStats(userId: string) {
    const [followers, following] = await Promise.all([
      prisma.follow.count({
        where: {
          followingId: userId,
        },
      }),

      prisma.follow.count({
        where: {
          followerId: userId,
        },
      }),
    ]);

    return {
      followers,
      following,
    };
  }
}
