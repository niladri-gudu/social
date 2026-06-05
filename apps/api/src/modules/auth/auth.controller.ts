import type { FastifyReply, FastifyRequest } from "fastify";

import { AuthService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(request.body);

    const { user, accessToken, refreshToken } =
      await AuthService.register(data);

    reply.setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.status(201).send({ user });
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(request.body);

    const { user, accessToken, refreshToken } = await AuthService.login(data);

    reply.setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({ user });
  }

  static async refresh(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(401).send({ message: "Refresh token missing" });
    }

    const { accessToken } = await AuthService.refresh(refreshToken);

    reply.setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return reply.send({
      success: true,
    });
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies.refreshToken;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    reply.clearCookie("accessToken", {
      path: "/",
    });

    reply.clearCookie("refreshToken", {
      path: "/",
    });

    return reply.send({
      success: true,
    });
  }
}
