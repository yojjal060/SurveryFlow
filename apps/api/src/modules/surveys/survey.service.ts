import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { createSlug } from "../../utils/slug.js";

type SurveySchemaInput = {
  version: number;
  questions: unknown[];
};

async function uniqueSlug(title: string): Promise<string> {
  const base = createSlug(title);
  let slug = base;
  let suffix = 2;

  while (await prisma.survey.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export async function createSurvey(title: string, description: string) {
  return prisma.survey.create({
    data: {
      title,
      description,
      slug: await uniqueSlug(title),
      status: "DRAFT",
      schema: { version: 1, questions: [] } as Prisma.InputJsonObject
    }
  });
}

export async function listSurveys() {
  return prisma.survey.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getSurvey(id: string) {
  return prisma.survey.findUnique({ where: { id } });
}

export async function updateSurvey(
  id: string,
  input: { title?: string; description?: string; schema?: SurveySchemaInput }
) {
  return prisma.survey.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.schema !== undefined
        ? { schema: input.schema as Prisma.InputJsonObject }
        : {})
    }
  });
}

export async function deleteSurvey(id: string) {
  return prisma.survey.delete({ where: { id } });
}

export async function publishSurvey(id: string) {
  const survey = await prisma.survey.findUnique({ where: { id } });
  if (!survey) return null;

  const schema = survey.schema as { questions?: unknown[] };
  if (!schema.questions?.length) {
    throw new Error("Cannot publish a survey without questions");
  }

  return prisma.survey.update({
    where: { id },
    data: { status: "PUBLISHED" }
  });
}

export async function unpublishSurvey(id: string) {
  return prisma.survey.update({
    where: { id },
    data: { status: "DRAFT" }
  });
}

export async function getPublishedSurvey(slug: string) {
  return prisma.survey.findFirst({
    where: { slug, status: "PUBLISHED" }
  });
}
