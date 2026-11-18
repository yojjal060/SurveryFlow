import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import {
  useDeleteSurvey,
  usePublication,
  useSurveys
} from "@/features/surveys/survey.hooks";
import type { Survey } from "@/types/survey";

function SurveyRow({ survey }: { survey: Survey }) {
  const publication = usePublication(survey.id);
  const deletion = useDeleteSurvey();
  const [copied, setCopied] = useState(false);

  const remove = () => {
    if (window.confirm(`Delete "${survey.title}"?`)) {
      deletion.mutate(survey.id);
    }
  };

  const copyPublicLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/s/${survey.slug}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="border-b border-neutral-200 p-5 last:border-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-medium">{survey.title}</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs ${survey.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>
              {survey.status}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{survey.description || "No description"}</p>
          <p className="mt-2 text-xs text-neutral-500">
            {survey._count?.responses ?? 0} responses · Updated {new Date(survey.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/surveys/${survey.id}/edit`}>
            <Button className="border border-neutral-300 bg-white text-neutral-900">Edit</Button>
          </Link>
          {survey.status === "PUBLISHED" ? (
            <>
              <a
                href={`/s/${survey.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="border border-neutral-300 bg-white text-neutral-900">View public</Button>
              </a>
              <Button className="border border-neutral-300 bg-white text-neutral-900" onClick={copyPublicLink}>
                {copied ? "Link copied" : "Copy link"}
              </Button>
            </>
          ) : null}
          <a
            href={`/surveys/${survey.id}/analytics`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="border border-neutral-300 bg-white text-neutral-900">Analytics</Button>
          </a>
          <Button
            className="border border-neutral-300 bg-white text-neutral-900"
            disabled={publication.isPending}
            onClick={() => publication.mutate(survey.status === "DRAFT")}
          >
            {publication.isPending ? "Saving..." : survey.status === "DRAFT" ? "Publish" : "Unpublish"}
          </Button>
          <Button
            className="border border-red-200 bg-white text-red-700"
            disabled={deletion.isPending}
            onClick={remove}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

export function SurveyListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const surveysQuery = useSurveys();

  if (surveysQuery.isLoading) return <LoadingState label="Loading surveys..." />;
  if (surveysQuery.isError) return <ErrorState message={surveysQuery.error.message} />;

  const surveys = (surveysQuery.data ?? []).filter((survey) => {
    const matchesSearch = survey.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "ALL" || survey.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <PageHeader title="My Surveys" description="Search and manage your surveys." />
        <Link to="/surveys/new">
          <Button>Create Survey</Button>
        </Link>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title"
          className="h-10 min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-3"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-md border border-neutral-300 bg-white px-3"
        >
          <option value="ALL">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <section className="rounded-lg border border-neutral-200 bg-white">
        {surveys.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title={surveysQuery.data?.length ? "No matching surveys" : "No surveys yet"}
              description={surveysQuery.data?.length ? "Try another search or status filter." : "Create your first survey to get started."}
            />
          </div>
        ) : (
          surveys.map((survey) => <SurveyRow key={survey.id} survey={survey} />)
        )}
      </section>
    </div>
  );
}
