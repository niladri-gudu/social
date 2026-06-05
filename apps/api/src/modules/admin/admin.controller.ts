import { FastifyReply, FastifyRequest } from "fastify";

import { AdminService } from "./admin.service.js";

export class AdminController {
  static async getFailedJobs(request: FastifyRequest, reply: FastifyReply) {
    const jobs = await AdminService.getFailedJobs();

    return reply.send(jobs);
  }

  static async replayFailedJob(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const result = await AdminService.replayFailedJob(request.params.id);

    return reply.send(result);
  }

  static async getReplayedJobs(request: FastifyRequest, reply: FastifyReply) {
    const jobs = await AdminService.getReplayedJobs();

    return reply.send(jobs);
  }

  static async getDLQMetrics(request: FastifyRequest, reply: FastifyReply) {
    const metrics = await AdminService.getDLQMetrics();

    return reply.send(metrics);
  }
}
