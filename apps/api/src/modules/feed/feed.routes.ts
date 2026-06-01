import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../auth/auth.middleware.js";

import { FeedController } from "./feed.controller.js";

export async function feedRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: authMiddleware,
    },
    FeedController.getFeed,
  );
}
