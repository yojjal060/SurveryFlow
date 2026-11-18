import { z } from "zod";
import { surveySchemaDefinition } from "../../utils/survey-validator.js";

export const createSurveySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().default("")
});

export const updateSurveySchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  schema: surveySchemaDefinition.optional()
});
