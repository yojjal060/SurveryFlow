import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { healthResponseSchema, type HealthResponse } from "@survey-builder/shared";
import { env } from "./env.js";
import { openApiDocument } from "./openapi.js";

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  const payload: HealthResponse = healthResponseSchema.parse({
    status: "ok",
    timestamp: new Date().toISOString()
  });
  res.status(200).json(payload);
});

app.get("/ready", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ready" });
});

app.get("/openapi.json", (_req: Request, res: Response) => {
  res.status(200).json(openApiDocument);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  const message = error instanceof Error ? error.message : "Internal server error";
  res.status(500).json({ error: message });
});

app.listen(env.PORT, () => {
  console.log(`Survey Builder API listening on port ${env.PORT}`);
});
