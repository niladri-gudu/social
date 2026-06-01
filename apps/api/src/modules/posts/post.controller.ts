import { FastifyReply, FastifyRequest } from "fastify";

import { createPostSchema } from "./post.schema.js";

import { PostService } from "./post.service.js";

type PostParams = {
  postId: string;
};

type UserParams = {
  userId: string;
};

export class PostController {
  static async createPost(request: FastifyRequest, reply: FastifyReply) {
    const data = createPostSchema.parse(request.body);

    const post = await PostService.createPost(request.user!.userId, data);

    return reply.status(201).send(post);
  }

  static async getPost(
    request: FastifyRequest<{ Params: PostParams }>,
    reply: FastifyReply,
  ) {
    const post = await PostService.getPost(request.params.postId);

    return reply.send(post);
  }

  static async deletePost(
    request: FastifyRequest<{ Params: PostParams }>,
    reply: FastifyReply,
  ) {
    const result = await PostService.deletePost(
      request.params.postId,
      request.user!.userId,
    );

    return reply.send(result);
  }

  static async getUserPosts(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) {
    const posts = await PostService.getUserPosts(request.params.userId);

    return reply.send(posts);
  }
}
