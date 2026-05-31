import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../auth/auth.middleware.js";

import { LikeController } from "./like.controller.js";

export async function likeRoutes(app: FastifyInstance) {
  app.post<{ Params: { postId: string } }>(
    "/:postId",
    {
      preHandler: authMiddleware,
    },
    LikeController.likePost,
  );

  app.delete<{ Params: { postId: string } }>(
    "/:postId",
    {
      preHandler: authMiddleware,
    },
    LikeController.unlikePost,
  );

  app.get<{ Params: { postId: string } }>(
    "/:postId/users",
    LikeController.getPostLikes,
  );

  app.get<{ Params: { postId: string } }>(
    "/:postId/count",
    LikeController.getLikeCount,
  );

  app.get<{ Params: { postId: string } }>(
    "/:postId/me",
    {
      preHandler: authMiddleware,
    },
    LikeController.hasLiked,
  );
}
