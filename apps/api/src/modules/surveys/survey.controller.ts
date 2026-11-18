import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { createSurveySchema, updateSurveySchema } from "./survey.validation.js";
import {
  createSurvey,
  deleteSurvey,
  getPublishedSurvey,
  getSurvey,
  listSurveys,
  publishSurvey,
  unpublishSurvey,
  updateSurvey
} from "./survey.service.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createSurveySchema.parse(req.body);
    res.status(201).json(await createSurvey(input.title, input.description));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({ error: "A survey with this slug already exists" });
      return;
    }
    next(error);
  }
}

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await listSurveys());
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }
    const survey = await getSurvey(id);
    if (!survey) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    res.json(survey);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }
    const input = updateSurveySchema.parse(req.body);
    res.json(await updateSurvey(id, input));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }
    await deleteSurvey(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    next(error);
  }
}

export async function publish(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }
    const survey = await publishSurvey(id);
    if (!survey) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    res.json(survey);
  } catch (error) {
    next(error);
  }
}

export async function unpublish(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }
    const survey = await unpublishSurvey(id);
    res.json(survey);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    next(error);
  }
}

export async function publicGet(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = req.params.slug;
    if (typeof slug !== "string") {
      res.status(400).json({ error: "Invalid survey slug" });
      return;
    }
    const survey = await getPublishedSurvey(slug);
    if (!survey) {
      res.status(404).json({ error: "Published survey not found" });
      return;
    }
    res.json(survey);
  } catch (error) {
    next(error);
  }
}
