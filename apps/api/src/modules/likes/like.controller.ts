import type { FastifyReply, FastifyRequest } from "fastify";

import { LikeService } from "./like.service.js";

type PostParams = {
  postId: string;
};

export class LikeController {
  static async likePost(
    request: FastifyRequest<{
      Params: PostParams;
    }>,
    reply: FastifyReply,
  ) {
    const result = await LikeService.likePost(
      request.user!.userId,
      request.params.postId,
    );

    return reply.send(result);
  }

  static async unlikePost(
    request: FastifyRequest<{
      Params: PostParams;
    }>,
    reply: FastifyReply,
  ) {
    const result = await LikeService.unlikePost(
      request.user!.userId,
      request.params.postId,
    );

    return reply.send(result);
  }

  static async getPostLikes(
    request: FastifyRequest<{
      Params: PostParams;
    }>,
    reply: FastifyReply,
  ) {
    const result = await LikeService.getPostLikes(request.params.postId);

    return reply.send(result);
  }

  static async getLikeCount(
    request: FastifyRequest<{
      Params: PostParams;
    }>,
    reply: FastifyReply,
  ) {
    const result = await LikeService.getLikeCount(request.params.postId);

    return reply.send(result);
  }

  static async hasLiked(
    request: FastifyRequest<{
      Params: PostParams;
    }>,
    reply: FastifyReply,
  ) {
    const result = await LikeService.hasLiked(
      request.user!.userId,
      request.params.postId,
    );

    return reply.send(result);
  }
}
