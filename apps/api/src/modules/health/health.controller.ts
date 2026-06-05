import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { HealthService } from "./health.service.js";

export class HealthController {
  static async getHealth(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const health =
      await HealthService.checkHealth();

    return reply.send(health);
  }
}