import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
      <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeader title="Analytics" description={survey.title} />
        <Link to={`/surveys/${survey.id}/responses`}>
          <Button className="border border-neutral-200 bg-white text-neutral-900 shadow-sm">
            View responses
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <section className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.03)]">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">Total responses</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{analytics.totalResponses}</p>
        </section>
        <section className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.03)]">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">Status</p>
          <p className="mt-3">
            <span className={`rounded-full px-2.5 py-1 text-sm font-medium ${survey.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>
              {survey.status}
            </span>
          </p>
        </section>
        <section className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.03)]">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">Average rating</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {analytics.averageRating === null ? "-" : analytics.averageRating.toFixed(1)}
            {analytics.averageRating !== null ? <span className="ml-1 text-base text-neutral-400">/ 5</span> : null}
          </p>
        </section>
        <section className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.03)]">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">Last response</p>
          <p className="mt-3 text-sm font-semibold leading-6">
            {analytics.lastResponseAt ? new Date(analytics.lastResponseAt).toLocaleDateString() : "-"}
          </p>
        </section>
      </div>
      {analytics.totalResponses === 0 ? (
        <div className="mt-6">
          <EmptyState title="No responses yet" description="Submit a public response to see analytics." />
        </div>
      ) : (
        <div className="mt-7 grid items-start gap-5 xl:grid-cols-2">
          {analytics.questions.map((result, index) => {
            const question = questions.find((item) => item.id === result.questionId);
            return (
              <section key={result.questionId} className={`overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(23,23,23,0.03)] ${result.type === "TEXT" ? "xl:col-span-2" : ""}`}>
                <header className="flex items-start justify-between gap-4 border-b border-neutral-100 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-neutral-400">QUESTION {index + 1}</p>
                    <h2 className="mt-1 font-semibold">{question?.title ?? result.questionId}</h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
                    {result.type.replaceAll("_", " ")}
                  </span>
                </header>
                <div className="p-5">
                  {result.type === "TEXT" ? (
                    result.answers?.length ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {result.answers.map((answer, index) => (
                          <blockquote
                            key={`${index}-${answer}`}
                            className="rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-3 text-sm leading-6 text-neutral-700"
                          >
                            “{answer}”
                          </blockquote>
                        ))}
                      </div>
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
