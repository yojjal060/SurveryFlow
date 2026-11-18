import type { Question } from "@survey-builder/shared";
import type { UseFormSetValue } from "react-hook-form";

export function RatingQuestion({
  question,
  value,
  setValue,
  error
}: {
  question: Question;
  value: unknown;
  setValue: UseFormSetValue<Record<string, unknown>>;
  error?: string;
}) {
  return (
    <div className="mt-3 flex gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          type="button"
          key={rating}
          className={`flex h-11 w-11 items-center justify-center rounded-md border ${value === rating ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-300 bg-white"}`}
          onClick={() => setValue(question.id, rating, { shouldDirty: true, shouldValidate: true })}
        >
          {rating}
        </button>
      ))}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
