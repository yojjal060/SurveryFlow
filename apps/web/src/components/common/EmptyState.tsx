export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 px-6 py-12 text-center">
      <h2 className="font-medium text-neutral-950">{title}</h2>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </div>
  );
}
