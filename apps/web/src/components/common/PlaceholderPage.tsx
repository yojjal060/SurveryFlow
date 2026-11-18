import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export function PlaceholderPage({ title }: { title: string }) {
  const params = useParams();
  return (
    <div>
      <PageHeader title={title} />
      <EmptyState title="Coming soon" description={`This ${title.toLowerCase()} page is ready for feature implementation.`} />
      {params.slug ? <span className="sr-only">{params.slug}</span> : null}
    </div>
  );
}
