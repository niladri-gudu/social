"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const serviceChecks = [
  { name: "API", url: "http://localhost:4000/health" },
  { name: "WebSocket", url: "http://localhost:4001" },
  { name: "PostgreSQL", url: "localhost:5432" },
  { name: "Redis", url: "localhost:6379" },
];

export default function Home() {
  useEffect(() => {
    const socket = io("http://localhost:4000", {
      auth: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXB6bXYzYTYwMDAzbHJ6NDhicmdlcGNtIiwiaWF0IjoxNzgwNjU1NTAwLCJleHAiOjE3ODA2NTY0MDB9.H6sC3F1y2Wwq6AowEYLRy14NkILdHINQh-b9TA62XCc",
      },
    });

    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    return () => {
      console.log("disconnecting socket");
      socket.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="border-b border-zinc-300 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Backend Portfolio Infrastructure
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
            Realtime Notification & Activity Feed System
          </h1>
        </header>

        <section className="grid gap-3 md:grid-cols-2">
          {serviceChecks.map((service) => (
            <div
              key={service.name}
              className="rounded border border-zinc-300 bg-white p-4 shadow-sm"
            >
              <div className="text-sm font-medium text-zinc-500">
                {service.name}
              </div>
              <div className="mt-1 font-mono text-sm text-zinc-900">
                {service.url}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
