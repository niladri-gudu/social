import type { FastifyReply, FastifyRequest } from "fastify";

import { NotificationService } from "@repo/notifications";
type NotificationParams = {
  id: string;
};

export class NotificationController {
  static async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    const notifications = await NotificationService.getNotifications(
      request.user!.userId,
    );

    return reply.send(notifications);
  }

  static async getUnreadCount(request: FastifyRequest, reply: FastifyReply) {
    const count = await NotificationService.getUnreadCount(
      request.user!.userId,
    );

    return reply.send(count);
  }

  static async markAsRead(
    request: FastifyRequest<{
      Params: NotificationParams;
    }>,
    reply: FastifyReply,
  ) {
    const notification = await NotificationService.markAsRead(
      request.params.id,
      request.user!.userId,
    );

    return reply.send(notification);
  }

  static async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    const result = await NotificationService.markAllAsRead(
      request.user!.userId,
    );

    return reply.send(result);
  }
}
