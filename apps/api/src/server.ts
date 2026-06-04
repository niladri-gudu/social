import { app } from "./app.js";
import { initializeSocket } from "./socket/socket.js";
import { startNotificationSubscriber } from "./socket/notification-subscriber.js";

const PORT = Number(process.env.API_PORT) || 5000;

async function start() {
  try {
    await app.ready();

    initializeSocket(app.server);

    await startNotificationSubscriber();

    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
