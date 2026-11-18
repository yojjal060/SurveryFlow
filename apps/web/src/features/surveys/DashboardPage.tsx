import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useSurveys } from "@/features/surveys/survey.hooks";

export function DashboardPage() {
  const surveysQuery = useSurveys();

  if (surveysQuery.isLoading) return <LoadingState label="Loading dashboard..." />;
  if (surveysQuery.isError) {
    return <ErrorState message={surveysQuery.error.message} />;
  }

  const surveys = surveysQuery.data ?? [];
  const published = surveys.filter((survey) => survey.status === "PUBLISHED").length;
  const drafts = surveys.filter((survey) => survey.status === "DRAFT").length;
  const responses = surveys.reduce(
    (total, survey) => total + (survey._count?.responses ?? 0),
    0
  );

  const cards = [
    { label: "Total surveys", value: surveys.length },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Total responses", value: responses }
  ];

  return (
    <div>
      <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeader title="Overview" description="Survey workspace summary" />
        <Link to="/surveys/new">
          <Button>Create Survey</Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <section key={card.label} className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.03)]">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</p>
          </section>
        ))}
      </div>
      <section className="mt-6 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(23,23,23,0.03)]">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-semibold">Recent surveys</h2>
          <Link to="/surveys" className="text-sm font-medium text-neutral-500 hover:text-neutral-950">View all</Link>
        </div>
        {surveys.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No surveys yet" description="Create your first survey to get started." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-neutral-500">
                <tr className="border-b border-neutral-200">
                  <th className="px-5 py-3 font-medium">Survey</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Responses</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {surveys.slice(0, 5).map((survey) => (
                  <tr key={survey.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-5 py-4">
                      <Link className="font-medium hover:underline" to={`/surveys/${survey.id}/edit`}>
                        {survey.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4">{survey.status}</td>
                    <td className="px-5 py-4">{survey._count?.responses ?? 0}</td>
                    <td className="px-5 py-4 text-neutral-500">
                      {new Date(survey.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
