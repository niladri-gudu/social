import { z } from "zod";

export const QueueName = {
  Notifications: "notifications",
  Feed: "feed",
  Email: "email",
} as const;

export const PubSubChannel = {
  Notifications: "notifications:realtime",
  Presence: "presence:realtime",
} as const;

export const notificationJobSchema = z.object({
  recipientId: z.string().cuid(),
  actorId: z.string().cuid(),

  type: z.enum(["LIKE", "COMMENT", "FOLLOW"]),

  postId: z.string().cuid().optional(),

  commentId: z.string().cuid().optional(),
});

export type NotificationJob = z.infer<typeof notificationJobSchema>;
