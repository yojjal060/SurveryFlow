export function SuccessPage({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-lg rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">✓</div>
        <h1 className="mt-5 text-2xl font-semibold">Response submitted</h1>
        <p className="mt-2 text-neutral-500">Thank you for completing {title}.</p>
      </div>
    </main>
  );
}
