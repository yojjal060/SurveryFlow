import { prisma } from "../../config/database.js";

type ChoiceOption = { id: string; label: string; value: string };
type Question = {
  id: string;
  type: "TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "RATING";
  options?: ChoiceOption[];
};

export async function getAnalytics(surveyId: string, textPage: number, textPageSize: number) {
  const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
  if (!survey) return null;

  const responses = await prisma.response.findMany({
    where: { surveyId },
    orderBy: { submittedAt: "desc" }
  });
  const schema = survey.schema as unknown as { questions: Question[] };
  const questions = schema.questions.map((question) => {
    const answers = responses
      .map((response) => {
        const answers = response.answers as Record<string, unknown>;
        return answers[question.id];
      })
      .filter((answer) => answer !== undefined);

    if (question.type === "TEXT") {
      const textAnswers = answers.filter((answer): answer is string => typeof answer === "string");
      const start = (textPage - 1) * textPageSize;
      return {
        questionId: question.id,
        type: question.type,
        answers: textAnswers.slice(start, start + textPageSize),
        page: textPage,
        pageSize: textPageSize,
        totalTextAnswers: textAnswers.length
      };
    }

    if (question.type === "RATING") {
      const ratings = answers.filter((answer): answer is number =>
        typeof answer === "number" && Number.isInteger(answer)
      );
      return {
        questionId: question.id,
        type: question.type,
        average: ratings.length
          ? Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2))
          : 0,
        totalRatings: ratings.length
      };
    }

    const results = (question.options ?? []).map((option) => {
      const count = answers.filter((answer) => {
        if (question.type === "SINGLE_CHOICE") return answer === option.value;
        return Array.isArray(answer) && answer.includes(option.value);
      }).length;
      return { label: option.label, count };
    });

    return {
      questionId: question.id,
      type: question.type,
      results
    };
  });

  return { totalResponses: responses.length, questions };
}
