export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-7">
      <nav aria-label="Breadcrumb" className="mb-2 text-xs font-medium text-neutral-400">
        Workspace <span className="mx-1 text-neutral-300">/</span> {title}
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">{title}</h1>
      {description ? <p className="mt-1 text-sm text-neutral-500">{description}</p> : null}
    </header>
  );
}
