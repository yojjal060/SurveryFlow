import type { Request, Response, NextFunction } from "express";
import { getAnalytics } from "./analytics.service.js";

export async function analytics(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }
    const textPage = Number.isFinite(Number(req.query.textPage))
      ? Math.max(1, Number(req.query.textPage))
      : 1;
    const textPageSize = Number.isFinite(Number(req.query.textPageSize))
      ? Math.min(100, Math.max(1, Number(req.query.textPageSize)))
      : 20;
    const result = await getAnalytics(id, textPage, textPageSize);
    if (!result) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}
