import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../auth/auth.middleware.js";

import { PostController } from "./post.controller.js";

export async function postRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      preHandler: authMiddleware,
    },
    PostController.createPost,
  );

  app.get(
    "/feed",
    {
      preHandler: authMiddleware,
    },
    PostController.getFeed,
  );

  app.get("/user/:userId", PostController.getUserPosts);

  app.get("/:postId", PostController.getPost);

  app.delete<{ Params: { postId: string } }>(
    "/:postId",
    {
      preHandler: authMiddleware,
    },
    PostController.deletePost,
  );
}
