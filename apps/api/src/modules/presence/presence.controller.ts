import type { FastifyReply, FastifyRequest } from "fastify";

import { PresenceService } from "@repo/presence";

export class PresenceController {
  static async getPresence(
    request: FastifyRequest<{
      Params: {
        userId: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const { userId } = request.params;

    const presence = await PresenceService.getPresence(userId);

    return reply.send(presence);
  }
}
