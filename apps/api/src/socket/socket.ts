import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { PresenceService } from "@repo/presence";

export let io: Server;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        userId: string;
      };

      socket.data.userId = payload.userId;

      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    await PresenceService.markOnline(userId);

    socket.join(`user:${userId}`);

    console.log(`user ${userId} connected`);

    console.log(`joined room user:${userId}`);

    socket.on("disconnect", async (reason) => {
      console.log("DISCONNECT EVENT", userId, reason);

      await PresenceService.markOffline(userId);

      console.log("MARKED OFFLINE", userId);
    });
  });

  return io;
}
