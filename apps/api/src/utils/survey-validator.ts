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

  for (let index = 0; index < schema.questions.length; index += 1) {
    const question = schema.questions[index];
    if (!question) continue;
    if (!question.condition) continue;

    const sourceIndex = schema.questions.findIndex(
      (candidate) => candidate.id === question.condition?.questionId
    );
    const source = sourceIndex >= 0 ? schema.questions[sourceIndex] : undefined;
    if (!source || sourceIndex >= index) {
      ctx.addIssue({
        code: "custom",
        message: "Condition must reference a previous question",
        path: ["questions", index, "condition"]
      });
    } else if (source.type !== "SINGLE_CHOICE") {
      ctx.addIssue({
        code: "custom",
        message: "Condition source must be a single-choice question",
        path: ["questions", index, "condition"]
      });
    } else if (!source.options?.some((option) => option.value === question.condition?.value)) {
      ctx.addIssue({
        code: "custom",
        message: "Condition answer must match a source option",
        path: ["questions", index, "condition"]
      });
    }
  }
});
