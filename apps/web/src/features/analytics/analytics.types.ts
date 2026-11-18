export interface AnalyticsQuestion {
  questionId: string;
  type: "TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "RATING";
  answers?: string[];
  page?: number;
  pageSize?: number;
  totalTextAnswers?: number;
  average?: number;
  totalRatings?: number;
  distribution?: { rating: number; count: number }[];
  results?: { label: string; count: number }[];
}

export interface SurveyAnalytics {
  totalResponses: number;
  averageRating: number | null;
  lastResponseAt: string | null;
  questions: AnalyticsQuestion[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, unknown>;
  submittedAt: string;
}

export interface ResponsePage {
  items: SurveyResponse[];
  page: number;
  pageSize: number;
  total: number;
}
