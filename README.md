# Realtime Feed System

Distributed realtime notification and activity feed backend portfolio project.

## Stack

- Turborepo + pnpm workspaces
- Next.js + Tailwind CSS
- Fastify API
- Socket.IO websocket gateway
- BullMQ workers
- Redis for queues, pub/sub, and cache
- PostgreSQL + Prisma

## Structure

```txt
apps/
  api/          Fastify REST API
  web/          Next.js frontend
  websocket/    Socket.IO gateway
  worker/       BullMQ workers

packages/
  auth/         JWT and password helpers
  config/       shared environment validation
  db/           Prisma schema and shared client
  events/       queue names, pub/sub channels, job schemas
  redis/        shared Redis connections
  types/        shared TypeScript types
  validation/   shared Zod request schemas
```

## Local Setup

1. Copy `.env.example` to `.env`.
2. Start infrastructure:

```bash
docker compose up -d
```

3. Install dependencies:

```bash
pnpm install
```

4. Generate Prisma client and push the starter schema:

```bash
pnpm db:generate
pnpm db:push
```

5. Run all apps:

```bash
pnpm dev
```

## Ports

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- WebSocket: `http://localhost:4001`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

The Prisma schema currently contains only a minimal `User` model so the shared DB package is ready. Replace or extend it when you design the real social graph, posts, comments, likes, notifications, feeds, and presence models.
