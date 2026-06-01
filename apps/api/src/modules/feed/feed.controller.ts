import type { FastifyReply, FastifyRequest } from "fastify";

import { feedQuerySchema } from "./feed.schema.js";

import { FeedService } from "./feed.service.js";

export class FeedController {
  static async getFeed(request: FastifyRequest, reply: FastifyReply) {
    const query = feedQuerySchema.parse(request.query);

    const feed = await FeedService.getFeed(request.user!.userId, query);

    return reply.send(feed);
  }
}
