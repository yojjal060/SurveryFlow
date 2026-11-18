import type { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
};
