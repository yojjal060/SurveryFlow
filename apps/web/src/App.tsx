import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoginPage } from "@/features/auth/LoginPage";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import { LoadingState } from "@/components/common/LoadingState";
import { DashboardPage } from "@/features/surveys/DashboardPage";
import { SurveyListPage } from "@/features/surveys/SurveyListPage";
import { CreateSurveyPage } from "@/features/surveys/CreateSurveyPage";
import { BuilderPage } from "@/features/survey-builder/BuilderPage";
import { PublicSurveyPage } from "@/features/survey-response/PublicSurveyPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
    mutations: { retry: false }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingState label="Loading SurveyFlow..." />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/surveys" element={<SurveyListPage />} />
                  <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
                  <Route path="/surveys/new" element={<CreateSurveyPage />} />
                  <Route path="/surveys/:id/edit" element={<BuilderPage />} />
                  <Route path="/surveys/:id/analytics" element={<PlaceholderPage title="Analytics" />} />
                  <Route path="/surveys/:id/responses" element={<PlaceholderPage title="Responses" />} />
                </Route>
              </Route>
              <Route path="/s/:slug" element={<PublicSurveyPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
