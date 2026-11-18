export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-2 text-xs text-neutral-500">
        Workspace / {title}
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">{title}</h1>
      {description ? <p className="mt-1 text-sm text-neutral-500">{description}</p> : null}
    </header>
  );
}
