import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useSurvey } from "@/features/surveys/survey.hooks";
import { useAnalytics } from "@/features/analytics/analytics.hooks";
import { ChoiceChart } from "@/features/analytics/charts/ChoiceChart";
import { RatingChart } from "@/features/analytics/charts/RatingChart";

export function AnalyticsPage() {
  const { id } = useParams();
  const surveyQuery = useSurvey(id ?? "");
  const analyticsQuery = useAnalytics(id ?? "");

  if (surveyQuery.isLoading || analyticsQuery.isLoading) return <LoadingState label="Loading analytics..." />;
  if (surveyQuery.isError) return <ErrorState message={surveyQuery.error.message} />;
  if (analyticsQuery.isError) return <ErrorState message={analyticsQuery.error.message} />;
  if (!surveyQuery.data || !analyticsQuery.data) return null;

  const survey = surveyQuery.data;
  const analytics = analyticsQuery.data;
  const questions = survey.schema.questions;

  return (
    <div>
      <PageHeader title="Analytics" description={survey.title} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total responses</p>
          <p className="mt-2 text-3xl font-semibold">{analytics.totalResponses}</p>
        </section>
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Status</p>
          <p className="mt-2 text-xl font-semibold">{survey.status}</p>
        </section>
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Average rating</p>
          <p className="mt-2 text-3xl font-semibold">
            {analytics.averageRating === null ? "-" : analytics.averageRating.toFixed(1)}
          </p>
        </section>
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Last response</p>
          <p className="mt-2 text-base font-semibold">
            {analytics.lastResponseAt ? new Date(analytics.lastResponseAt).toLocaleString() : "-"}
          </p>
        </section>
      </div>
      {analytics.totalResponses === 0 ? (
        <div className="mt-6">
          <EmptyState title="No responses yet" description="Submit a public response to see analytics." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {analytics.questions.map((result) => {
            const question = questions.find((item) => item.id === result.questionId);
            return (
              <section key={result.questionId} className="rounded-lg border border-neutral-200 bg-white p-5">
                <h2 className="font-medium">{question?.title ?? result.questionId}</h2>
                <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">{result.type.replaceAll("_", " ")}</p>
                <div className="mt-4">
                  {result.type === "TEXT" ? (
                    result.answers?.length ? (
                      <ul className="divide-y divide-neutral-100">
                        {result.answers.map((answer, index) => (
                          <li key={`${index}-${answer}`} className="py-3 text-sm">{answer}</li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-neutral-500">No text answers.</p>
                  ) : null}
                  {result.type === "SINGLE_CHOICE" || result.type === "MULTIPLE_CHOICE" ? (
                    <ChoiceChart results={result.results ?? []} total={analytics.totalResponses} />
                  ) : null}
                  {result.type === "RATING" ? (
                    <RatingChart
                      distribution={result.distribution ?? []}
                      average={result.average ?? 0}
                      total={result.totalRatings ?? 0}
                    />
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
