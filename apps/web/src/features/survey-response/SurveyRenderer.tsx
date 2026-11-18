import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Question } from "@survey-builder/shared";
import { evaluateCondition } from "@/lib/evaluate-condition";
import { QuestionRenderer } from "./QuestionRenderer";

export function SurveyRenderer({
  questions,
  register,
  setValue,
  values,
  errors
}: {
  questions: Question[];
  register: UseFormRegister<Record<string, unknown>>;
  setValue: UseFormSetValue<Record<string, unknown>>;
  values: Record<string, unknown>;
  errors: FieldErrors<Record<string, unknown>>;
}) {
  return (
    <div className="space-y-6">
      {questions.map((question) => {
        if (question.condition && !evaluateCondition(question.condition, values)) return null;
        return (
          <section key={question.id} className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium">
              {question.title}
              {question.required ? <span className="ml-1 text-red-600" aria-label="required">*</span> : null}
            </h2>
            {question.description ? <p className="mt-1 text-sm text-neutral-500">{question.description}</p> : null}
            <QuestionRenderer
              question={question}
              register={register}
              setValue={setValue}
              values={values}
              errors={errors}
            />
          </section>
        );
      })}
    </div>
  );
}
