import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../auth/auth.middleware.js";

import { CommentController } from "./comment.controller.js";

export async function commentRoutes(app: FastifyInstance) {
  app.post<{ Params: { postId: string } }>(
    "/:postId",
    {
      preHandler: authMiddleware,
    },
    CommentController.createComment,
  );

  app.delete<{ Params: { commentId: string } }>(
    "/:commentId",
    {
      preHandler: authMiddleware,
    },
    CommentController.deleteComment,
  );

  app.get<{ Params: { postId: string } }>(
    "/post/:postId",
    CommentController.getPostComments,
  );

  app.get<{ Params: { commentId: string } }>(
    "/:commentId",
    CommentController.getComment,
  );
}
