export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-40" role="status" aria-label={label}>
      <div className="animate-pulse space-y-3">
        <div className="h-5 w-40 rounded bg-neutral-200" />
        <div className="h-24 rounded-lg bg-neutral-100" />
      </div>
    </div>
  );
}
