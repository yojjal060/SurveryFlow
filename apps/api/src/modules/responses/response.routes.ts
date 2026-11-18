import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { get, list, submit } from "./response.controller.js";

export const responseRouter = Router();

responseRouter.post("/public/surveys/:slug/responses", submit);
responseRouter.get("/surveys/:id/responses", authMiddleware, list);
responseRouter.get("/surveys/:id/responses/:responseId", authMiddleware, get);
