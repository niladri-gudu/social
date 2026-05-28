const serviceChecks = [
  { name: "API", url: "http://localhost:4000/health" },
  { name: "WebSocket", url: "http://localhost:4001" },
  { name: "PostgreSQL", url: "localhost:5432" },
  { name: "Redis", url: "localhost:6379" }
];

export default function Home() {
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
              <div className="text-sm font-medium text-zinc-500">{service.name}</div>
              <div className="mt-1 font-mono text-sm text-zinc-900">{service.url}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
