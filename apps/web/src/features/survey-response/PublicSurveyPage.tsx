import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { ApiError } from "@/lib/api";
import { evaluateCondition } from "@/lib/evaluate-condition";
import { usePublicSurvey, useSubmitResponse } from "./survey-response.hooks";
import { SurveyRenderer } from "./SurveyRenderer";
import { SuccessPage } from "./SuccessPage";

export function PublicSurveyPage() {
  const { slug } = useParams();
  const publicSlug = slug ?? "";
  const surveyQuery = usePublicSurvey(publicSlug);
  const submission = useSubmitResponse(publicSlug);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, setValue, control, handleSubmit, clearErrors, formState: { errors, isSubmitting } } =
    useForm<Record<string, unknown>>({ defaultValues: {} });
  const values = useWatch({ control, defaultValue: {} });

  useEffect(() => {
    if (!surveyQuery.data) return;
    for (const question of surveyQuery.data.schema.questions) {
      if (question.condition && !evaluateCondition(question.condition, values)) {
        if (values[question.id] !== undefined) {
          setValue(question.id, undefined);
          clearErrors(question.id);
        }
      }
    }
  }, [values, surveyQuery.data, setValue, clearErrors]);

  if (surveyQuery.isLoading) return <LoadingState label="Loading survey..." />;
  if (surveyQuery.isError) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <ErrorState message={surveyQuery.error instanceof ApiError && surveyQuery.error.status === 404
          ? "Published survey not found."
          : surveyQuery.error.message} />
      </main>
    );
  }
  if (!surveyQuery.data) return null;
  if (submitted) return <SuccessPage title={surveyQuery.data.title} />;

  const survey = surveyQuery.data;
  const submit = async (allValues: Record<string, unknown>) => {
    setSubmitError("");

    const visibleAnswers: Record<string, unknown> = {};
    for (const question of survey.schema.questions) {
      if (question.condition && !evaluateCondition(question.condition, allValues)) continue;
      const answer = allValues[question.id];

      if (question.required && (answer === undefined || answer === null || answer === "" ||
        (Array.isArray(answer) && answer.length === 0))) {
        setSubmitError(`Required question unanswered: ${question.title}`);
        return;
      }

      if (answer !== undefined) {
        if (question.type === "RATING" &&
          (typeof answer !== "number" || !Number.isInteger(answer) || answer < 1 || answer > 5)) {
          setSubmitError(`Choose a rating from 1 to 5: ${question.title}`);
          return;
        }
        visibleAnswers[question.id] = answer;
      }
    }

    try {
      await submission.mutateAsync(visibleAnswers);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit response");
    }
  };

  const answeredCount = survey.schema.questions.filter((question) =>
    !question.condition || evaluateCondition(question.condition, values)
  ).filter((question) => values[question.id] !== undefined).length;
  const visibleCount = survey.schema.questions.filter((question) =>
    !question.condition || evaluateCondition(question.condition, values)
  ).length;
  const progress = visibleCount === 0 ? 0 : Math.round((answeredCount / visibleCount) * 100);

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 rounded-lg border border-neutral-200 bg-white p-6">
          <h1 className="text-3xl font-semibold tracking-tight">{survey.title}</h1>
          {survey.description ? <p className="mt-2 text-neutral-600">{survey.description}</p> : null}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full bg-neutral-900 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-neutral-500">{progress}% complete</p>
        </header>
        <form onSubmit={handleSubmit(submit)}>
          <SurveyRenderer
            questions={survey.schema.questions}
            register={register}
            setValue={setValue}
            values={values}
            errors={errors}
          />
          {submitError ? <div className="mt-4"><ErrorState message={submitError} /></div> : null}
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={submission.isPending || isSubmitting}>
              {submission.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
