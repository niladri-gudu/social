import type { FastifyInstance } from "fastify";

import { DevController } from "./dev.controller.js";

export async function devRoutes(app: FastifyInstance) {
  app.post("/notifications", DevController.generateNotifications);

  app.post("/activity", DevController.generateActivity);
}
