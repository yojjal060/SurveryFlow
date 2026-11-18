import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { analytics } from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.get("/surveys/:id/analytics", authMiddleware, analytics);
