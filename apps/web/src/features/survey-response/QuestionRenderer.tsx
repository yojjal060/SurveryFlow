import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Question } from "@survey-builder/shared";
import { TextQuestion } from "./question-renderers/TextQuestion";
import { SingleChoiceQuestion } from "./question-renderers/SingleChoiceQuestion";
import { MultipleChoiceQuestion } from "./question-renderers/MultipleChoiceQuestion";
import { RatingQuestion } from "./question-renderers/RatingQuestion";

export function QuestionRenderer({
  question,
  register,
  setValue,
  values,
  errors
}: {
  question: Question;
  register: UseFormRegister<Record<string, unknown>>;
  setValue: UseFormSetValue<Record<string, unknown>>;
  values: Record<string, unknown>;
  errors: FieldErrors<Record<string, unknown>>;
}) {
  const error = errors[question.id]?.message as string | undefined;
  switch (question.type) {
    case "TEXT":
      return <TextQuestion question={question} register={register} error={error} />;
    case "SINGLE_CHOICE":
      return <SingleChoiceQuestion question={question} register={register} error={error} />;
    case "MULTIPLE_CHOICE":
      return <MultipleChoiceQuestion question={question} register={register} error={error} />;
    case "RATING":
      return (
        <RatingQuestion
          question={question}
          value={values[question.id]}
          setValue={setValue}
          error={error}
        />
      );
  }
}
