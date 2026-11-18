import { z } from "zod";

export const questionTypeSchema = z.enum([
  "TEXT",
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "RATING"
]);

export const questionSchema = z.object({
  id: z.string().min(1),
  type: questionTypeSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  multiline: z.boolean().optional(),
  options: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    value: z.string()
  })).optional(),
  condition: z.object({
    questionId: z.string().min(1),
    operator: z.literal("EQUALS"),
    value: z.string()
  }).optional()
});
