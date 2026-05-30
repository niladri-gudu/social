import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../auth/auth.middleware.js";

import { FollowController } from "./follow.controller.js";

type UserParams = {
  userId: string;
};

export async function followRoutes(app: FastifyInstance) {
  app.post<{ Params: UserParams }>(
    "/:userId",
    {
      preHandler: authMiddleware,
    },
    FollowController.followUser,
  );

  app.delete<{ Params: UserParams }>(
    "/:userId",
    {
      preHandler: authMiddleware,
    },
    FollowController.unfollowUser,
  );

  app.get<{ Params: UserParams }>(
    "/:userId/followers",
    FollowController.getFollowers,
  );

  app.get<{ Params: UserParams }>(
    "/:userId/following",
    FollowController.getFollowing,
  );

  app.get<{ Params: UserParams }>("/:userId/stats", FollowController.getStats);
}
