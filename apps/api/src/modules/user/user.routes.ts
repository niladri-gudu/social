import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../auth/auth.middleware.js";

import { UserController } from "./user.controller.js";

export async function userRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: authMiddleware }, UserController.getMe);
  app.patch(
    "/me",
    { preHandler: authMiddleware },
    UserController.updateProfile,
  );
  app.get("/:id", UserController.getUserById);
}
