import type { Condition } from "@survey-builder/shared";

export function evaluateCondition(
  condition: Condition,
  answers: Record<string, unknown>
): boolean {
  return answers[condition.questionId] === condition.value;
}
