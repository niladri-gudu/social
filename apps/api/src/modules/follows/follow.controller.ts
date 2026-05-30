import type { FastifyReply, FastifyRequest } from "fastify";

import { FollowService } from "./follow.service.js";

type UserParams = {
  userId: string;
};

export class FollowController {
  static async followUser(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) {
    const result = await FollowService.followUser(
      request.user!.userId,
      request.params.userId,
    );

    return reply.send(result);
  }

  static async unfollowUser(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) {
    const result = await FollowService.unfollowUser(
      request.user!.userId,
      request.params.userId,
    );

    return reply.send(result);
  }

  static async getFollowers(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) {
    const result = await FollowService.getFollowers(request.params.userId);

    return reply.send(result);
  }

  static async getFollowing(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) {
    const result = await FollowService.getFollowing(request.params.userId);

    return reply.send(result);
  }

  static async getStats(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) {
    const result = await FollowService.getStats(request.params.userId);

    return reply.send(result);
  }
}
