export interface Condition {
  questionId: string;
  operator: "EQUALS";
  value: string;
}

export function evaluateCondition(
  condition: Condition,
  answers: Record<string, unknown>
): boolean {
  return answers[condition.questionId] === condition.value;
}
