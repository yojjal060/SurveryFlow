import type { ErrorRequestHandler } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: error.issues
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "A record with that value already exists" });
      return;
    }
    if (error.code === "P2025") {
      res.status(404).json({ error: "Record not found" });
      return;
    }
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  if (
    message === "Cannot publish a survey without questions"
    || message.startsWith("Unknown question ID:")
    || message.startsWith("Answer submitted for hidden question:")
    || message.startsWith("Required question unanswered:")
    || message.startsWith("Invalid text answer:")
    || message.startsWith("Rating must be")
    || message.startsWith("Invalid choice answer:")
    || message.startsWith("Invalid checkbox answer:")
  ) {
    res.status(400).json({ error: message });
    return;
  }
  res.status(500).json({ error: message });
};
