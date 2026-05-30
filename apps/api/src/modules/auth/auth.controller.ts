import type { FastifyReply, FastifyRequest } from "fastify";

import { AuthService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(request.body);

    const result = await AuthService.register(data);

    return reply.status(201).send(result);
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(request.body);

    const result = await AuthService.login(data);

    return reply.send(result);
  }

  static async refresh(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.body as { refreshToken: string };

    const result = await AuthService.refresh(refreshToken);

    return reply.send(result);
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.body as { refreshToken: string };

    const result = await AuthService.logout(refreshToken);

    return reply.send(result);
  }
}
