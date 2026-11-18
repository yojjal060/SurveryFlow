import type { ReactNode } from "react";

export function BuilderLayout({
  toolbar,
  preview,
  settings,
  settingsOpen
}: {
  toolbar: ReactNode;
  preview: ReactNode;
  settings: ReactNode;
  settingsOpen: boolean;
}) {
  return (
    <div className="grid min-h-[calc(100vh-150px)] grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(23,23,23,0.04)] lg:grid-cols-[180px_minmax(0,1fr)_320px]">
      <aside className="hidden border-r border-neutral-200 p-3 lg:block">{toolbar}</aside>
      <main className="min-w-0 overflow-y-auto bg-neutral-50 p-4 sm:p-6">{preview}</main>
      {settingsOpen ? (
        <button
          type="button"
          aria-label="Close settings"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => undefined}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-[min(360px,90vw)] overflow-y-auto border-l border-neutral-200 bg-white transition-transform lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${settingsOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {settings}
      </aside>
    </div>
  );
}
