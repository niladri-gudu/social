import { FastifyInstance } from "fastify";

import { AdminController } from "./admin.controller.js";

export async function adminRoutes(app: FastifyInstance) {
  app.get("/failed-jobs", AdminController.getFailedJobs);

  app.post("/failed-jobs/:id/replay", AdminController.replayFailedJob);

  app.get("/replayed-jobs", AdminController.getReplayedJobs);

  app.get("/metrics", AdminController.getDLQMetrics);
}
