import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";

export async function authRoutes(app: FastifyInstance) {
  {
    app.post("/register", AuthController.register);

    app.post("/login", AuthController.login);

    app.get(
      "/me",
      { preHandler: authMiddleware },
      async (request: FastifyRequest, reply: FastifyReply) => {
        return {
          user: request.user,
        };
      },
    );

    app.post("/refresh", AuthController.refresh);

    app.post("/logout", AuthController.logout);
  }
}
