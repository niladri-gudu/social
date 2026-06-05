import type { FastifyInstance } from "fastify";

import { HealthController } from "./health.controller.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/", HealthController.getHealth);
}
