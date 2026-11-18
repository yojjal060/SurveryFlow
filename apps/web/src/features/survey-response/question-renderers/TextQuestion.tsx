import type { Question } from "@survey-builder/shared";
import type { UseFormRegister } from "react-hook-form";

export function TextQuestion({
  question,
  register,
  error
}: {
  question: Question;
  register: UseFormRegister<Record<string, unknown>>;
  error?: string;
}) {
  const field = register(question.id, { required: question.required ? "This field is required." : false });
  return (
    <div>
      {question.multiline ? (
        <textarea
          className="mt-3 min-h-24 w-full rounded-md border border-neutral-300 px-3 py-2"
          placeholder={question.placeholder}
          {...field}
        />
      ) : (
        <input
          className="mt-3 h-11 w-full rounded-md border border-neutral-300 px-3"
          placeholder={question.placeholder}
          {...field}
        />
      )}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
