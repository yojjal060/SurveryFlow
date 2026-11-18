import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useSurvey } from "@/features/surveys/survey.hooks";
import { useResponse, useResponses } from "@/features/analytics/analytics.hooks";

export function ResponseList() {
  const { id } = useParams();
  const surveyQuery = useSurvey(id ?? "");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const responsesQuery = useResponses(id ?? "", page);
  const responseQuery = useResponse(id ?? "", selectedId);

  if (surveyQuery.isLoading || responsesQuery.isLoading) return <LoadingState label="Loading responses..." />;
  if (surveyQuery.isError) return <ErrorState message={surveyQuery.error.message} />;
  if (responsesQuery.isError) return <ErrorState message={responsesQuery.error.message} />;
  if (!surveyQuery.data || !responsesQuery.data) return null;

  const { items, total, pageSize } = responsesQuery.data;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const selected = responseQuery.data;

  return (
    <div>
      <PageHeader title="Responses" description={surveyQuery.data.title} />
      {items.length === 0 ? (
        <EmptyState title="No responses yet" description="Submitted public responses will appear here." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="text-neutral-500">
                <tr className="border-b border-neutral-200">
                  <th className="px-5 py-3 font-medium">Submission</th>
                  <th className="px-5 py-3 font-medium">Response ID</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((response) => (
                  <tr key={response.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-5 py-4">{new Date(response.submittedAt).toLocaleString()}</td>
                    <td className="max-w-36 truncate px-5 py-4 font-mono text-xs text-neutral-500">{response.id}</td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        className="border border-neutral-300 bg-white text-neutral-900"
                        onClick={() => setSelectedId(response.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-3">
              <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button
                  className="border border-neutral-300 bg-white text-neutral-900"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>
                <Button
                  className="border border-neutral-300 bg-white text-neutral-900"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
          <aside className="rounded-lg border border-neutral-200 bg-white p-5">
            {!selectedId ? (
              <p className="text-sm text-neutral-500">Select a response to view details.</p>
            ) : responseQuery.isLoading ? (
              <LoadingState label="Loading response..." />
            ) : responseQuery.isError ? (
              <ErrorState message={responseQuery.error.message} />
            ) : selected ? (
              <div>
                <div className="border-b border-neutral-200 pb-4">
                  <p className="text-xs text-neutral-500">Response ID</p>
                  <p className="mt-1 break-all font-mono text-xs">{selected.id}</p>
                  <p className="mt-3 text-sm">{new Date(selected.submittedAt).toLocaleString()}</p>
                </div>
                <dl className="mt-4 space-y-4">
                  {surveyQuery.data.schema.questions.map((question) => {
                    const answer = selected.answers[question.id];
                    const display = Array.isArray(answer)
                      ? answer.join(", ")
                      : answer === undefined || answer === null || answer === ""
                        ? "No answer"
                        : String(answer);
                    return (
                      <div key={question.id}>
                        <dt className="text-sm font-medium">{question.title}</dt>
                        <dd className="mt-1 text-sm text-neutral-600">{display}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ) : null}
          </aside>
        </div>
      )}
    </div>
  );
}
