import type { Question, QuestionType } from "@survey-builder/shared";

export type BuilderAction =
  | { type: "SET"; questions: Question[] }
  | { type: "ADD"; question: Question }
  | { type: "UPDATE"; questionId: string; updates: Partial<Question> }
  | { type: "DELETE"; questionId: string }
  | { type: "REORDER"; questions: Question[] };

export function builderReducer(state: Question[], action: BuilderAction): Question[] {
  switch (action.type) {
    case "SET":
      return action.questions;
    case "ADD":
      return [...state, action.question];
    case "UPDATE":
      return state.map((question) =>
        question.id === action.questionId
          ? { ...question, ...action.updates }
          : question
      );
    case "DELETE":
      return state
        .filter((question) => question.id !== action.questionId)
        .map((question) => question.condition?.questionId === action.questionId
          ? { ...question, condition: undefined }
          : question);
    case "REORDER":
      return action.questions;
  }
}

export function createQuestion(type: QuestionType): Question {
  const id = crypto.randomUUID();
  const base = { id, type, title: "Untitled question", required: false };
  if (type === "TEXT") return { ...base, placeholder: "", multiline: false };
  if (type === "RATING") return base;
  return {
    ...base,
    options: [
      { id: crypto.randomUUID(), label: "Option 1", value: "Option 1" }
    ]
  };
}
