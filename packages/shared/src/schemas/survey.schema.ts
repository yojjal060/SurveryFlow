import { z } from "zod";
import { questionSchema } from "./question.schema.js";

export const surveySchemaDefinition = z.object({
  version: z.number().int().nonnegative(),
  questions: z.array(questionSchema)
});

export const surveySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  slug: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  schema: surveySchemaDefinition,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});
