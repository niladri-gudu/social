import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";

import { generateAccessToken, generateRefreshToken } from "./auth.utils.js";

import type { LoginInput, RegisterInput } from "./auth.schema.js";

export class AuthService {
  private static async createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await prisma.session.create({
      data: {
        userId,
        refreshToken: "temporary-token",
        expiresAt,
      },
    });

    const accessToken = generateAccessToken(userId);

    const refreshToken = generateRefreshToken(session.id);

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  static async register(data: RegisterInput) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
      },
    });

    const { accessToken, refreshToken } = await this.createSession(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const { accessToken, refreshToken } = await this.createSession(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return user;
  }

  static async refresh(refreshToken: string) {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as {
      sessionId: string;
    };

    const session = await prisma.session.findUnique({
      where: {
        id: payload.sessionId,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new Error("Invalid refresh token");
    }

    if (session.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    if (session.expiresAt < new Date()) {
      throw new Error("Session expired");
    }

    const accessToken = generateAccessToken(session.user.id);

    return {
      accessToken,
    };
  }

  static async logout(refreshToken: string) {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as {
      sessionId: string;
    };

    await prisma.session.delete({
      where: {
        id: payload.sessionId,
      },
    });

    return {
      success: true,
    };
  }
}
