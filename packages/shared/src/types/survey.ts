import type { Question } from "./question.js";

export interface SurveySchema {
  version: number;
  questions: Question[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  schema: SurveySchema;
  createdAt: string;
  updatedAt: string;
}
