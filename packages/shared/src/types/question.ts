export type QuestionType =
  | "TEXT"
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "RATING";

export interface Condition {
  questionId: string;
  operator: "EQUALS";
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  placeholder?: string;
  multiline?: boolean;
  options?: {
    id: string;
    label: string;
    value: string;
  }[];
  condition?: Condition;
}
