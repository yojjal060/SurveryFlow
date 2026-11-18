import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Survey } from "@/types/survey";

export function usePublicSurvey(slug: string) {
  return useQuery({
    queryKey: ["public-survey", slug],
    queryFn: () => api<Survey>(`/public/surveys/${encodeURIComponent(slug)}`)
  });
}

export function useSubmitResponse(slug: string) {
  return useMutation({
    mutationFn: (answers: Record<string, unknown>) =>
      api<{ id: string; submittedAt: string }>(
        `/public/surveys/${encodeURIComponent(slug)}/responses`,
        { method: "POST", body: JSON.stringify({ answers }) }
      )
  });
}
