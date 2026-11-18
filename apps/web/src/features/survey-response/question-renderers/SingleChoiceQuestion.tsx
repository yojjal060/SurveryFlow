import type { Question } from "@survey-builder/shared";
import type { UseFormRegister } from "react-hook-form";

export function SingleChoiceQuestion({
  question,
  register,
  error
}: {
  question: Question;
  register: UseFormRegister<Record<string, unknown>>;
  error?: string;
}) {
  return (
    <div className="mt-3 space-y-2">
      {question.options?.map((option) => (
        <label key={option.id} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3">
          <input
            type="radio"
            value={option.value}
            {...register(question.id, { required: question.required ? "Choose an option." : false })}
          />
          {option.label}
        </label>
      ))}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
