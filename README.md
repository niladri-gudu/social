# Strata

> A production-grade distributed social platform built to explore realtime systems, event-driven architecture, background job processing, caching, reliability engineering, and operational observability.

---

## Overview

Strata is a backend-first social platform designed to simulate the architecture of modern social networks such as Twitter, LinkedIn, and Discord.

The project goes beyond traditional CRUD applications by implementing:

- Realtime notifications
- Activity feeds
- Redis caching
- BullMQ workers
- Dead Letter Queues (DLQ)
- Replay systems
- Presence tracking
- Queue monitoring
- Distributed event processing

The primary goal of Strata is to demonstrate backend engineering principles commonly found in large-scale production systems.

---

## Features

### Authentication

- JWT-based authentication
- Access tokens
- Refresh tokens
- Session management
- HttpOnly cookie authentication
- Secure logout
- Token refresh flow

### Social Graph

- Follow users
- Unfollow users
- View followers
- View following

### Posts

- Create posts
- View posts
- Fetch user posts

### Likes

- Like posts
- Unlike posts

### Comments

- Create comments
- View comments

### Feed System

- Personalized feed generation
- Cursor-based pagination
- Feed DTOs
- Feed aggregation layer

### Notifications

- Follow notifications
- Like notifications
- Comment notifications
- Unread notification counts

### Realtime Infrastructure

- Socket.IO
- Redis Pub/Sub
- User-specific rooms
- Realtime notification delivery

### Presence System

- Online status
- Offline status
- Last seen timestamps

### Reliability Engineering

- Retry policies
- Exponential backoff
- Dead Letter Queue (DLQ)
- Failed job persistence
- Replay system
- Recovery metrics

### Monitoring & Observability

- Health checks
- Queue metrics
- Worker metrics
- Replay history
- Recovery rate tracking
- Bull Board dashboard

---

# Architecture

## High-Level Architecture

```text
                 ┌─────────────┐
                 │   Client    │
                 └──────┬──────┘
                        │
                        ▼
              ┌──────────────────┐
              │   Fastify API    │
              └────────┬─────────┘
                       │
      ┌────────────────┼────────────────┐
      │                │                │
      ▼                ▼                ▼
 PostgreSQL         Redis          Socket.IO
      │                │                │
      │                │                │
      ▼                ▼                ▼
 Notifications     Cache          Realtime Events
      │
      ▼
   BullMQ
      │
      ▼
    Worker
      │
      ▼
 Redis Pub/Sub
      │
      ▼
 Socket.IO
      │
      ▼
   Clients
```

---

## Notification Pipeline

When a user follows another user:

```text
Follow User
     │
     ▼
API Request
     │
     ▼
BullMQ Queue
     │
     ▼
Worker
     │
     ▼
Notification Service
     │
     ├────────► PostgreSQL
     │
     ├────────► Redis Count Cache
     │
     └────────► Redis Pub/Sub
                     │
                     ▼
                 Socket.IO
                     │
                     ▼
                 Recipient
```

---

## Failure Recovery Flow

```text
Notification Job
       │
       ▼
    Worker
       │
       ▼
   Failure
       │
       ▼
Retry Attempt #1
       │
       ▼
Retry Attempt #2
       │
       ▼
Retry Attempt #3
       │
       ▼
 Failed Job Table
       │
       ▼
Admin Replay
       │
       ▼
BullMQ Queue
       │
       ▼
Successfully Processed
```

---

# Tech Stack

## Backend

- Node.js
- TypeScript
- Fastify

## Database

- PostgreSQL
- Prisma ORM

## Caching

- Redis

## Background Processing

- BullMQ

## Realtime

- Socket.IO
- Redis Pub/Sub

## Validation

- Zod

## Monorepo

- Turborepo
- pnpm Workspaces

---

# Monorepo Structure

```text
strata/
│
├── apps/
│   ├── api/
│   └── worker/
│
├── packages/
│   ├── db/
│   ├── redis/
│   ├── queues/
│   ├── notifications/
│   ├── events/
│   ├── presence/
│   └── config/
│
└── ...
```

---

# Core Packages

## @repo/db

Provides:

- Prisma Client
- Database access
- Shared database layer

---

## @repo/redis

Provides:

- Redis connections
- Redis helpers
- Cache key management

---

## @repo/events

Provides:

- Queue names
- Pub/Sub channels
- Shared event schemas
- Zod validation

---

## @repo/queues

Provides:

- BullMQ queue definitions
- Retry configuration
- Exponential backoff policies

---

## @repo/notifications

Provides:

- Notification creation
- Cache updates
- Notification business logic

---

## @repo/presence

Provides:

- Online status tracking
- Last seen management

---

# Monitoring

## Health Check

```http
GET /health
```

Response:

```json
{
  "status": "healthy",
  "services": {
    "api": "healthy",
    "database": "healthy",
    "redis": "healthy"
  }
}
```

---

## Queue Metrics

```http
GET /api/admin/queue-metrics
```

Provides:

- Waiting jobs
- Active jobs
- Completed jobs
- Failed jobs
- Delayed jobs

---

## Worker Metrics

```http
GET /api/admin/worker-metrics
```

Provides:

- Processed jobs
- Failed jobs
- Success rate

---

## Failed Jobs

```http
GET /api/admin/failed-jobs
```

Provides:

- Error details
- Original payload
- Failure timestamps

---

## Replay Failed Job

```http
POST /api/admin/failed-jobs/:id/replay
```

Allows operators to replay failed jobs.

---

## Bull Board

```text
/admin/queues
```

Provides:

- Queue inspection
- Job payloads
- Retry information
- Failure analysis
- Queue state visualization

---

# Presence System

Users are tracked using Redis.

Online:

```text
presence:<userId>:online
```

Last Seen:

```text
presence:<userId>:last-seen
```

Example Response:

```json
{
  "online": true,
  "lastSeen": null
}
```

or

```json
{
  "online": false,
  "lastSeen": "2026-06-06T10:25:00.000Z"
}
```

---

# Reliability Features

## Retries

Every notification job supports:

```text
Attempts: 3
Backoff: Exponential
Delay: 1s → 2s → 4s
```

---

## Dead Letter Queue

Failed jobs are persisted to PostgreSQL after exhausting retries.

Stored Information:

- Queue name
- Original payload
- Error message
- Failure timestamp

---

## Replay System

Failed jobs can be replayed manually through the admin API.

Replay history is tracked for auditing and recovery metrics.

---

# Future Improvements

- Fan-out-on-write feed generation
- Feed caching
- Timeline precomputation workers
- Multi-region deployment
- Distributed rate limiting
- Media uploads
- Search infrastructure
- Recommendation engine
- Analytics pipeline
- Kubernetes deployment

---

# Key Learnings

Building Strata provided hands-on experience with:

- Event-driven architecture
- Realtime systems
- Distributed caching
- Background job processing
- Reliability engineering
- Queue management
- Dead Letter Queues
- Failure recovery
- Presence systems
- Monitoring and observability
- Production backend design patterns

---

# Author

**Niladribihari Mohanta**

Backend Engineer | TypeScript | Node.js | Distributed Systems

GitHub: https://github.com/niladri-gudu
