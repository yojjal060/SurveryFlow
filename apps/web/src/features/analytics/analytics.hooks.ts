import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SurveyAnalytics, ResponsePage, SurveyResponse } from "./analytics.types";

export function useAnalytics(id: string) {
  return useQuery({
    queryKey: ["analytics", id],
    queryFn: () => api<SurveyAnalytics>(`/surveys/${id}/analytics`)
  });
}

export function useResponses(id: string, page: number) {
  return useQuery({
    queryKey: ["responses", id, page],
    queryFn: () => api<ResponsePage>(`/surveys/${id}/responses?page=${page}&pageSize=20`)
  });
}

export function useResponse(id: string, responseId: string | null) {
  return useQuery({
    queryKey: ["response", id, responseId],
    enabled: Boolean(responseId),
    queryFn: () => api<SurveyResponse>(`/surveys/${id}/responses/${responseId}`)
  });
}
