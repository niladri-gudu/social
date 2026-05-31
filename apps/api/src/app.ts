import Fastify, { fastify, FastifyReply, FastifyRequest } from "fastify";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { followRoutes } from "./modules/follows/follow.routes.js";
import { postRoutes } from "./modules/posts/post.routes.js";
import { likeRoutes } from "./modules/likes/like.routes.js";

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

app.register(userRoutes, {
  prefix: "/api/users",
});

app.register(followRoutes, {
  prefix: "/api/follows",
});

app.register(postRoutes, {
  prefix: "/api/posts",
});

app.register(likeRoutes, {
  prefix: "/api/likes",
});

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  return reply.status(400).send({
    success: false,
    message: error instanceof Error ? error.message : "Unknown error",
  });
});
