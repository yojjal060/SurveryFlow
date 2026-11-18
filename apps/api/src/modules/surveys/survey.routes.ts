import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  create,
  get,
  list,
  publish,
  publicGet,
  remove,
  unpublish,
  update
} from "./survey.controller.js";

export const surveyRouter = Router();

surveyRouter.post("/surveys", authMiddleware, create);
surveyRouter.get("/surveys", authMiddleware, list);
surveyRouter.get("/surveys/:id", authMiddleware, get);
surveyRouter.patch("/surveys/:id", authMiddleware, update);
surveyRouter.delete("/surveys/:id", authMiddleware, remove);
surveyRouter.post("/surveys/:id/publish", authMiddleware, publish);
surveyRouter.post("/surveys/:id/unpublish", authMiddleware, unpublish);
surveyRouter.get("/public/surveys/:slug", publicGet);
