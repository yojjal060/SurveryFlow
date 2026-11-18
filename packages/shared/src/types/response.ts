export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, unknown>;
  submittedAt: string;
}
