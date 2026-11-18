import { z } from "zod";

export const submitResponseSchema = z.object({
  answers: z.record(z.string(), z.unknown())
});
