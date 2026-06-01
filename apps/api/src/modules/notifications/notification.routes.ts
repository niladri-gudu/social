import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../auth/auth.middleware.js";

import { NotificationController } from "./notification.controller.js";

export async function notificationRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: authMiddleware,
    },
    NotificationController.getNotifications,
  );

  app.get(
    "/unread-count",
    {
      preHandler: authMiddleware,
    },
    NotificationController.getUnreadCount,
  );

  app.patch<{ Params: { id: string } }>(
    "/:id/read",
    {
      preHandler: authMiddleware,
    },
    NotificationController.markAsRead,
  );

  app.patch(
    "/read-all",
    {
      preHandler: authMiddleware,
    },
    NotificationController.markAllAsRead,
  );
}
