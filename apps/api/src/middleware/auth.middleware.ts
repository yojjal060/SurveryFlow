import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "JWT_SECRET is not configured" });
    return;
  }

  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = bearer ?? req.cookies?.access_token;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload !== "object" || typeof payload.adminId !== "string") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.locals.adminId = payload.adminId;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};
