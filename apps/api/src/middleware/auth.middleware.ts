import type { RequestHandler } from "express";

export const authMiddleware: RequestHandler = (_req, res) => {
  res.status(401).json({ error: "Unauthorized" });
};
