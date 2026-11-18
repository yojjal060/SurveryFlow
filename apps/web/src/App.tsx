import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

function ApplicationShell() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link className="font-semibold text-neutral-950" to="/">
            Survey Builder
          </Link>
          <span className="text-sm text-neutral-500">Boilerplate</span>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Survey Builder</h1>
        <p className="mt-3 max-w-xl text-neutral-600">
          React application shell. Survey features are not implemented yet.
        </p>
        <Button className="mt-6" disabled>
          Placeholder
        </Button>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<ApplicationShell />} />
            <Route path="*" element={<ApplicationShell />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
