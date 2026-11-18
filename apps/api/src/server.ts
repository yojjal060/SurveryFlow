import http from "node:http";
import { app } from "./app.js";
import { prisma } from "./config/database.js";
import { env } from "./config/env.js";

const server = http.createServer(app);

void prisma.$connect();

server.listen(env.PORT, () => {
  console.log(`Survey Builder API listening on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
