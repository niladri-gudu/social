import { subscriber } from "@repo/redis";
import { PubSubChannel } from "@repo/events";

import { io } from "./socket.js";

export async function startNotificationSubscriber() {
  await subscriber.subscribe(PubSubChannel.Notifications);

  subscriber.on("message", async (_, message) => {
    const payload = JSON.parse(message);

    io.to(`user:${payload.recipientId}`).emit("notification", payload);
  });

  console.log("Notification subscriber running...");
}
