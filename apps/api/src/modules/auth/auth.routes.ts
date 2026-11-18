import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { login, logout, me, register } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, me);
authRouter.post("/logout", logout);
