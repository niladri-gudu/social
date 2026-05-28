import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import Fastify from "fastify";
import { Queue } from "bullmq";
import { env } from "@repo/config";
import { prisma } from "@repo/db";
import { QueueName, type NotificationJob } from "@repo/events";
import { createRedisConnection } from "@repo/redis";
import { loginSchema, registerSchema } from "@repo/validation";
import { hashPassword, signAccessToken, signRefreshToken, verifyPassword } from "@repo/auth";

const app = Fastify({
  logger: true
});

const notificationQueue = new Queue<NotificationJob>(QueueName.Notifications, {
  connection: createRedisConnection()
});

app.register(cors, {
  origin: true,
  credentials: true
});
app.register(sensible);

app.get("/health", async () => {
  await prisma.$queryRaw`SELECT 1`;
  return { status: "ok" };
});

app.post("/auth/register", async (request, reply) => {
  const input = registerSchema.parse(request.body);
  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      name: input.name,
      passwordHash
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      imageUrl: true,
      createdAt: true
    }
  });

  return reply.code(201).send({
    user,
    accessToken: signAccessToken({ sub: user.id, username: user.username }),
    refreshToken: signRefreshToken({ sub: user.id, username: user.username })
  });
});

app.post("/auth/login", async (request, reply) => {
  const input = loginSchema.parse(request.body);
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw app.httpErrors.unauthorized("Invalid email or password");
  }

  return reply.send({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt
    },
    accessToken: signAccessToken({ sub: user.id, username: user.username }),
    refreshToken: signRefreshToken({ sub: user.id, username: user.username })
  });
});

app.post("/dev/notifications", async (request, reply) => {
  const job = request.body as NotificationJob;
  await notificationQueue.add("notification.created", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000
    },
    removeOnComplete: 100,
    removeOnFail: false
  });

  return reply.code(202).send({ queued: true });
});

const start = async () => {
  try {
    await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

await start();
