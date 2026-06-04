import { subscriber } from "@repo/redis";
import { PubSubChannel } from "@repo/events";
import { realtimeNotificationSchema } from "@repo/events";

import { io } from "./socket.js";

export async function startNotificationSubscriber() {
  await subscriber.subscribe(PubSubChannel.Notifications);

  subscriber.on("message", async (_, message) => {
    const payload = realtimeNotificationSchema.parse(JSON.parse(message));


    io.to(`user:${payload.notification.recipientId}`).emit(
      "notification:created",
      payload,
    );
  });

  console.log("Notification subscriber running...");
}
