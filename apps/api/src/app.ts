import Fastify, { fastify, FastifyReply, FastifyRequest } from "fastify";

import { authRoutes } from "./modules/auth/auth.routes.js";

export const app = Fastify({
  logger: true,
});

app.get("/", async () => {
  return {
    success: true,
    message: "API Running",
  };
});

app.register(authRoutes, {
  prefix: "/api/auth",
});

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  return reply.status(400).send({
    success: false,
    message: error instanceof Error ? error.message : "Unknown error",
  });
});
