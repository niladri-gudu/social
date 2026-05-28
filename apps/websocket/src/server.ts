import { createServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { env } from "@repo/config";
import { verifyAccessToken } from "@repo/auth";
import { PubSubChannel } from "@repo/events";
import { createRedisConnection, subscriber } from "@repo/redis";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true
  }
});

const pubClient = createRedisConnection();
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (typeof token !== "string") {
    return next(new Error("Missing auth token"));
  }

  try {
    const payload = verifyAccessToken(token);
    socket.data.userId = payload.sub;
    return next();
  } catch {
    return next(new Error("Invalid auth token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId as string;
  socket.join(`user:${userId}`);
  socket.emit("presence:connected", { userId });
});

await subscriber.subscribe(PubSubChannel.Notifications);

subscriber.on("message", (channel, message) => {
  if (channel !== PubSubChannel.Notifications) {
    return;
  }

  const payload = JSON.parse(message) as { recipientId: string };
  io.to(`user:${payload.recipientId}`).emit("notification:new", payload);
});

httpServer.listen(env.WEBSOCKET_PORT, () => {
  console.log(`websocket gateway listening on ${env.WEBSOCKET_PORT}`);
});
