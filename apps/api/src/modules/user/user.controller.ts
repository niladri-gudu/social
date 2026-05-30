import type { FastifyReply, FastifyRequest } from "fastify";

import { UserService } from "./user.service.js";
import { updateProfileSchema } from "./user.schema.js";

export class UserController {
  static async getMe(request: FastifyRequest, reply: FastifyReply) {
    const user = await UserService.getMe(request.user!.userId);

    return reply.send(user);
  }

  static async getUserById(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const user = await UserService.getUserById(request.params.id);

    return reply.send(user);
  }

  static async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = updateProfileSchema.parse(request.body);

    const user = await UserService.updateProfile(request.user!.userId, data);

    return reply.send(user);
  }
}
