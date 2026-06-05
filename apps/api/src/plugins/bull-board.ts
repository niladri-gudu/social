import { FastifyInstance } from "fastify";

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";

import { notificationQueue } from "@repo/queues";

export async function registerBullBoard(app: FastifyInstance) {
  const serverAdapter = new FastifyAdapter();

  serverAdapter.setBasePath("/admin/queues");

  createBullBoard({
    queues: [new BullMQAdapter(notificationQueue)],
    serverAdapter,
  });

  await app.register(serverAdapter.registerPlugin(), {
    prefix: "/admin/queues",
  });
}
