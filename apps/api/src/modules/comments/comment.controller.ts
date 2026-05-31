import type { FastifyReply, FastifyRequest } from "fastify";

import { createCommentSchema } from "./comment.schema.js";

import { CommentService } from "./comment.service.js";

type PostParams = {
  postId: string;
};

type CommentParams = {
  commentId: string;
};

export class CommentController {
  static async createComment(
    request: FastifyRequest<{
      Params: PostParams;
    }>,
    reply: FastifyReply,
  ) {
    const data = createCommentSchema.parse(request.body);

    const comment = await CommentService.createComment(
      request.user!.userId,
      request.params.postId,
      data,
    );

    return reply.status(201).send(comment);
  }

  static async deleteComment(
    request: FastifyRequest<{
      Params: CommentParams;
    }>,
    reply: FastifyReply,
  ) {
    const result = await CommentService.deleteComment(
      request.params.commentId,
      request.user!.userId,
    );

    return reply.send(result);
  }

  static async getPostComments(
    request: FastifyRequest<{
      Params: PostParams;
    }>,
    reply: FastifyReply,
  ) {
    const comments = await CommentService.getPostComments(
      request.params.postId,
    );

    return reply.send(comments);
  }

  static async getComment(
    request: FastifyRequest<{
      Params: CommentParams;
    }>,
    reply: FastifyReply,
  ) {
    const comment = await CommentService.getComment(request.params.commentId);

    return reply.send(comment);
  }
}
