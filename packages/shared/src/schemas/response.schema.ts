import { z } from "zod";

export const responseSchema = z.object({
  id: z.string().min(1),
  surveyId: z.string().min(1),
  answers: z.record(z.string(), z.unknown()),
  submittedAt: z.iso.datetime()
});
