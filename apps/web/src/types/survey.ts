import type { Question } from "@survey-builder/shared";

export type BuilderQuestion = Question;

export interface Survey {
  id: string;
  title: string;
  description: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  schema: {
    version: number;
    questions: BuilderQuestion[];
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    responses: number;
  };
}
