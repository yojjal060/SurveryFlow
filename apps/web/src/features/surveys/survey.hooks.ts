import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Survey } from "@/types/survey";

export function useSurveys() {
  return useQuery({
    queryKey: ["surveys"],
    queryFn: () => api<Survey[]>("/surveys")
  });
}

export function useCreateSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; description: string }) =>
      api<Survey>("/surveys", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["surveys"] });
    }
  });
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/surveys/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["surveys"] });
    }
  });
}

export function usePublication(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (publish: boolean) =>
      api<Survey>(`/surveys/${id}/${publish ? "publish" : "unpublish"}`, { method: "POST" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["surveys"] });
    }
  });
}

export function useSurvey(id: string) {
  return useQuery({
    queryKey: ["survey", id],
    queryFn: () => api<Survey>(`/surveys/${id}`)
  });
}

export function useSaveSurvey(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schema: Survey["schema"]) =>
      api<Survey>(`/surveys/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ schema })
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["survey", id] });
      void queryClient.invalidateQueries({ queryKey: ["surveys"] });
    }
  });
}
