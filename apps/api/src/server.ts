import { app } from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
