import { prisma } from "@repo/db";

import type { UpdateProfileInput } from "./user.schema.js";

export class UserService {
  static async getMe(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  static async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
      },
    });
  }
}
