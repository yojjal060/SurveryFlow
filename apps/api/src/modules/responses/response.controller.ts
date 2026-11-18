import type { Request, Response, NextFunction } from "express";
import { submitResponseSchema } from "./response.validation.js";
import { getResponse, listResponses, submitResponse } from "./response.service.js";

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = req.params.slug;
    if (typeof slug !== "string") {
      res.status(400).json({ error: "Invalid survey slug" });
      return;
    }
    const input = submitResponseSchema.parse(req.body);
    const response = await submitResponse(slug, input.answers);
    if (!response) {
      res.status(404).json({ error: "Published survey not found" });
      return;
    }
    res.status(201).json({ id: response.id, submittedAt: response.submittedAt });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }
    const page = Number.isFinite(Number(req.query.page)) ? Math.max(1, Number(req.query.page)) : 1;
    const pageSize = Number.isFinite(Number(req.query.pageSize))
      ? Math.min(100, Math.max(1, Number(req.query.pageSize)))
      : 20;
    res.json(await listResponses(id, page, pageSize));
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const responseId = req.params.responseId;
    if (typeof id !== "string" || typeof responseId !== "string") {
      res.status(400).json({ error: "Invalid response parameters" });
      return;
    }
    const response = await getResponse(id, responseId);
    if (!response) {
      res.status(404).json({ error: "Response not found" });
      return;
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
}
