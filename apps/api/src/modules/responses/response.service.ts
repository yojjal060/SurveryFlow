import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";

type ChoiceOption = { id: string; label: string; value: string };
type Question = {
  id: string;
  type: "TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "RATING";
  title: string;
  required: boolean;
  options?: ChoiceOption[];
  condition?: { questionId: string; operator: "EQUALS"; value: string };
};
type SurveySchema = { version: number; questions: Question[] };

function isVisible(question: Question, answers: Record<string, unknown>): boolean {
  if (!question.condition) return true;
  return answers[question.condition.questionId] === question.condition.value;
}

export function validateSubmission(schema: SurveySchema, answers: Record<string, unknown>) {
  const questionsById = new Map(schema.questions.map((question) => [question.id, question]));

  for (const answerQuestionId of Object.keys(answers)) {
    const question = questionsById.get(answerQuestionId);
    if (!question) {
      throw new Error(`Unknown question ID: ${answerQuestionId}`);
    }
    if (!isVisible(question, answers)) {
      throw new Error(`Answer submitted for hidden question: ${answerQuestionId}`);
    }
  }

  for (const question of schema.questions) {
    if (!isVisible(question, answers)) continue;

    const answer = answers[question.id];
    if (answer === undefined || answer === null || answer === "") {
      if (question.required) throw new Error(`Required question unanswered: ${question.id}`);
      continue;
    }

    if (question.type === "TEXT" && typeof answer !== "string") {
      throw new Error(`Invalid text answer: ${question.id}`);
    }

    if (question.type === "RATING") {
      if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 1 || answer > 5) {
        throw new Error(`Rating must be a whole number from 1 to 5: ${question.id}`);
      }
    }

    if (question.type === "SINGLE_CHOICE") {
      if (typeof answer !== "string" || !question.options?.some((option) => option.value === answer)) {
        throw new Error(`Invalid choice answer: ${question.id}`);
      }
    }

    if (question.type === "MULTIPLE_CHOICE") {
      if (!Array.isArray(answer)) throw new Error(`Invalid checkbox answer: ${question.id}`);
      const validValues = new Set(question.options?.map((option) => option.value));
      if (answer.some((value) => typeof value !== "string" || !validValues.has(value))) {
        throw new Error(`Invalid checkbox answer: ${question.id}`);
      }
    }
  }

  return answers;
}

export async function submitResponse(slug: string, answers: Record<string, unknown>) {
  const survey = await prisma.survey.findFirst({
    where: { slug, status: "PUBLISHED" }
  });
  if (!survey) return null;

  const schema = survey.schema as unknown as SurveySchema;
  const validAnswers = validateSubmission(schema, answers);
  return prisma.response.create({
    data: {
      surveyId: survey.id,
      answers: validAnswers as Prisma.InputJsonObject
    }
  });
}

export async function listResponses(surveyId: string, page: number, pageSize: number) {
  const [items, total] = await prisma.$transaction([
    prisma.response.findMany({
      where: { surveyId },
      orderBy: { submittedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.response.count({ where: { surveyId } })
  ]);
  return { items, page, pageSize, total };
}

export async function getResponse(surveyId: string, responseId: string) {
  return prisma.response.findFirst({
    where: { id: responseId, surveyId }
  });
}
