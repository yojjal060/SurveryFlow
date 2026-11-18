import cors from "cors";
import express from "express";
import { env } from "./env.js";

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(env.PORT, () => {
  console.log(`Survey Builder API listening on port ${env.PORT}`);
});
