import type { FastifyInstance } from "fastify";

import { PresenceController } from "./presence.controller.js";

export async function presenceRoutes(app: FastifyInstance) {
  app.get("/:userId", PresenceController.getPresence);
}
