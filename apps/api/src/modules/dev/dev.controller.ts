import type { FastifyReply, FastifyRequest } from "fastify";

import { DevService } from "./dev.service.js";

export class DevController {
  static async generateNotifications(
    request: FastifyRequest<{
      Body: {
        count?: number;
      };
    }>,
    reply: FastifyReply,
  ) {
    const result = await DevService.generateNotifications(
      request.body?.count ?? 10,
    );

    return reply.send(result);
  }

  static async generateActivity(request: FastifyRequest, reply: FastifyReply) {
    const result = await DevService.generateActivity();

    return reply.send(result);
  }
}
