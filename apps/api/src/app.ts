import Fastify, { fastify, FastifyReply, FastifyRequest } from "fastify";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { followRoutes } from "./modules/follows/follow.routes.js";
import { postRoutes } from "./modules/posts/post.routes.js";
import { likeRoutes } from "./modules/likes/like.routes.js";
import { commentRoutes } from "./modules/comments/comment.routes.js";
import { notificationRoutes } from "./modules/notifications/notification.routes.js";
import { feedRoutes } from "./modules/feed/feed.routes.js";
import { devRoutes } from "./modules/dev/dev.routes.js";
import { presenceRoutes } from "./modules/presence/presence.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";

export const app = Fastify({
  logger: true,
});

app.get("/", async () => {
  return {
    success: true,
    message: "API Running",
  };
});

app.register(healthRoutes, {
  prefix: "/health",
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

app.register(commentRoutes, {
  prefix: "/api/comments",
});

app.register(notificationRoutes, {
  prefix: "/api/notifications",
});

app.register(feedRoutes, {
  prefix: "/api/feed",
});

app.register(presenceRoutes, {
  prefix: "/api/presence",
});

if (process.env.NODE_ENV === "development") {
  app.register(devRoutes, {
    prefix: "/api/dev",
  });

  app.register(adminRoutes, {
    prefix: "/api/admin",
  });
}

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  return reply.status(400).send({
    success: false,
    message: error instanceof Error ? error.message : "Unknown error",
  });
});
