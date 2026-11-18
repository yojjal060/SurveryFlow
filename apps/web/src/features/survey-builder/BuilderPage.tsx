import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { usePublication, useSaveSurvey, useSurvey } from "@/features/surveys/survey.hooks";
import { builderReducer, createQuestion } from "@/features/survey-builder/builder";
import { BuilderLayout } from "@/features/survey-builder/BuilderLayout";
import { QuestionToolbar } from "@/features/survey-builder/QuestionToolbar";
import { QuestionList } from "@/features/survey-builder/QuestionList";
import { QuestionSettings } from "@/features/survey-builder/QuestionSettings";
import type { QuestionType } from "@survey-builder/shared";

export function BuilderPage() {
  const { id } = useParams();
  const surveyQuery = useSurvey(id ?? "");
  const saveSurvey = useSaveSurvey(id ?? "");
  const publication = usePublication(id ?? "");
  const [questions, dispatch] = useReducer(builderReducer, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (surveyQuery.data) {
      dispatch({ type: "SET", questions: surveyQuery.data.schema.questions });
      setSelectedId(surveyQuery.data.schema.questions[0]?.id ?? null);
    }
  }, [surveyQuery.data]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  if (!id) return <ErrorState message="Survey ID is missing" />;
  if (surveyQuery.isLoading) return <LoadingState label="Loading survey builder..." />;
  if (surveyQuery.isError) return <ErrorState message={surveyQuery.error.message} />;
  if (!surveyQuery.data) return <ErrorState message="Survey not found" />;

  const markDirty = () => {
    setDirty(true);
    setSaveError("");
  };

  const addQuestion = (type: QuestionType) => {
    const question = createQuestion(type);
    dispatch({ type: "ADD", question });
    setSelectedId(question.id);
    setSettingsOpen(true);
    markDirty();
  };

  const save = async () => {
    setSaveError("");
    try {
      await saveSurvey.mutateAsync({ version: 1, questions });
      setDirty(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save survey");
    }
  };

  const publish = async () => {
    setSaveError("");
    try {
      await saveSurvey.mutateAsync({ version: 1, questions });
      await publication.mutateAsync(true);
      setDirty(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not publish survey");
    }
  };

  const selected = questions.find((question) => question.id === selectedId);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <PageHeader title={surveyQuery.data.title} description={surveyQuery.data.description} />
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs ${dirty ? "text-amber-700" : "text-neutral-500"}`}>
            {saveSurvey.isPending ? "Saving..." : dirty ? "Unsaved changes" : "Saved"}
          </span>
          <Button type="button" className="border border-neutral-300 bg-white text-neutral-900" onClick={save} disabled={saveSurvey.isPending || publication.isPending}>
            Save draft
          </Button>
          <Button type="button" onClick={publish} disabled={saveSurvey.isPending || publication.isPending}>
            Publish
          </Button>
        </div>
      </div>
      {saveError ? <div className="mb-4"><ErrorState message={saveError} /></div> : null}
      <BuilderLayout
        toolbar={<QuestionToolbar onAdd={addQuestion} />}
        preview={
          <div>
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <span className="text-sm font-medium">Add question</span>
              <select
                className="h-9 rounded-md border border-neutral-300 bg-white px-2"
                value=""
                onChange={(event) => event.target.value && addQuestion(event.target.value as QuestionType)}
              >
                <option value="" disabled>Select type</option>
                <option value="TEXT">Text</option>
                <option value="SINGLE_CHOICE">Single choice</option>
                <option value="MULTIPLE_CHOICE">Checkbox</option>
                <option value="RATING">Rating</option>
              </select>
            </div>
            {questions.length === 0 ? (
              <EmptyState title="Start adding questions" description="Choose a question type from the left panel." />
            ) : (
              <QuestionList
                questions={questions}
                selectedId={selectedId}
                onSelect={(questionId) => {
                  setSelectedId(questionId);
                  setSettingsOpen(true);
                }}
                onDelete={(questionId) => {
                  dispatch({ type: "DELETE", questionId });
                  if (selectedId === questionId) setSelectedId(null);
                  markDirty();
                }}
                onReorder={(reordered) => {
                  dispatch({ type: "REORDER", questions: reordered });
                  markDirty();
                }}
              />
            )}
          </div>
        }
        settings={
          <QuestionSettings
            question={selected}
            questions={questions}
            onClose={() => setSettingsOpen(false)}
            onChange={(updates) => {
              if (!selectedId) return;
              dispatch({ type: "UPDATE", questionId: selectedId, updates });
              markDirty();
            }}
          />
        }
        settingsOpen={settingsOpen}
      />
    </div>
  );
}
