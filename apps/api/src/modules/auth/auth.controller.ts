import type { Request, Response, NextFunction } from "express";
import { credentialsSchema } from "./auth.validation.js";
import { getAdmin, loginAdmin, registerAdmin } from "./auth.service.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/"
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = credentialsSchema.parse(req.body);
    const admin = await registerAdmin(input.email, input.password);
    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = credentialsSchema.parse(req.body);
    const result = await loginAdmin(input.email, input.password);
    if (!result) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    res.cookie("access_token", result.token, cookieOptions);
    res.json({ admin: result.admin, accessToken: result.token });
  } catch (error) {
    next(error);
  }
}

export async function me(_req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await getAdmin(res.locals.adminId);
    if (!admin) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json(admin);
  } catch (error) {
    next(error);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("access_token", { path: "/" });
  res.status(204).send();
}
