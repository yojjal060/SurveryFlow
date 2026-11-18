export interface Survey {
  id: string;
  title: string;
  description: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  schema: {
    version: number;
    questions: unknown[];
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    responses: number;
  };
}
