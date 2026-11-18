import { z } from "zod";
import { questionSchema } from "@survey-builder/shared";

export const surveySchemaDefinition = z.object({
  version: z.number().int().nonnegative(),
  questions: z.array(questionSchema)
}).superRefine((schema, ctx) => {
  const questionIds = new Set<string>();

  for (const question of schema.questions) {
    if (questionIds.has(question.id)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate question ID: ${question.id}`,
        path: ["questions"]
      });
    }
    questionIds.add(question.id);

    const optionIds = new Set<string>();
    for (const option of question.options ?? []) {
      if (optionIds.has(option.id)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate option ID: ${option.id}`,
          path: ["questions"]
        });
      }
      optionIds.add(option.id);
    }
  }

  for (const question of schema.questions) {
    if (question.condition && !questionIds.has(question.condition.questionId)) {
      ctx.addIssue({
        code: "custom",
        message: `Unknown condition question ID: ${question.condition.questionId}`,
        path: ["questions"]
      });
    }
  }
});
