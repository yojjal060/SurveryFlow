import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { surveyRouter } from "./modules/surveys/survey.routes.js";
import { responseRouter } from "./modules/responses/response.routes.js";
import { analyticsRouter } from "./modules/analytics/analytics.routes.js";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/api/openapi.json", (_req, res) => res.json(openApiDocument));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/auth", authRouter);
app.use("/api", surveyRouter);
app.use("/api", responseRouter);
app.use("/api", analyticsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
