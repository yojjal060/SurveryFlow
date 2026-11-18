import type { Question } from "@survey-builder/shared";
import { Button } from "@/components/ui/button";

export function QuestionSettings({
  question,
  questions,
  onChange,
  onClose
}: {
  question: Question | undefined;
  questions: Question[];
  onChange: (updates: Partial<Question>) => void;
  onClose: () => void;
}) {
  if (!question) {
    return (
      <div className="p-5 text-sm text-neutral-500">
        Select a question to edit it.
      </div>
    );
  }

  const questionIndex = questions.findIndex((item) => item.id === question.id);
  const sources = questions.slice(0, questionIndex).filter((item) => item.type === "SINGLE_CHOICE");
  const source = sources.find((item) => item.id === question.condition?.questionId);

  const updateOption = (optionId: string, label: string) => {
    onChange({
      options: question.options?.map((option) =>
        option.id === optionId
          ? { ...option, label, value: label }
          : option
      )
    });
  };

  return (
    <div className="space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Question settings</h2>
        <button type="button" className="text-sm text-neutral-500 lg:hidden" onClick={onClose}>Close</button>
      </div>
      <label className="block text-sm font-medium">
        Title
        <input
          className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-3"
          value={question.title}
          onChange={(event) => onChange({ title: event.target.value })}
        />
      </label>
      <label className="block text-sm font-medium">
        Description
        <textarea
          className="mt-2 min-h-20 w-full rounded-md border border-neutral-300 px-3 py-2"
          value={question.description ?? ""}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </label>
      <label className="block text-sm font-medium">
        Type
        <select
          className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-3"
          value={question.type}
          onChange={(event) => {
            const type = event.target.value as Question["type"];
            if (type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE") {
              onChange({
                type,
                options: question.options?.length
                  ? question.options
                  : [{ id: crypto.randomUUID(), label: "Option 1", value: "Option 1" }]
              });
            } else {
              onChange({ type, options: undefined, condition: undefined });
            }
          }}
        >
          <option value="TEXT">Text</option>
          <option value="SINGLE_CHOICE">Single choice</option>
          <option value="MULTIPLE_CHOICE">Multiple choice</option>
          <option value="RATING">Rating</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={question.required}
          onChange={(event) => onChange({ required: event.target.checked })}
        />
        Required
      </label>
      {question.type === "TEXT" ? (
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Placeholder
            <input
              className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-3"
              value={question.placeholder ?? ""}
              onChange={(event) => onChange({ placeholder: event.target.value })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={question.multiline ?? false}
              onChange={(event) => onChange({ multiline: event.target.checked })}
            />
            Multiline
          </label>
        </div>
      ) : null}
      {(question.type === "SINGLE_CHOICE" || question.type === "MULTIPLE_CHOICE") ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Options</p>
          {question.options?.map((option) => (
            <div key={option.id} className="flex gap-2">
              <input
                className="h-9 min-w-0 flex-1 rounded-md border border-neutral-300 px-3"
                value={option.label}
                onChange={(event) => updateOption(option.id, event.target.value)}
              />
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() => onChange({ options: question.options?.filter((item) => item.id !== option.id) })}
              >
                Remove
              </button>
            </div>
          ))}
          <Button
            type="button"
            className="border border-neutral-300 bg-white text-neutral-900"
            onClick={() => onChange({
              options: [
                ...(question.options ?? []),
                { id: crypto.randomUUID(), label: `Option ${(question.options?.length ?? 0) + 1}`, value: `Option ${(question.options?.length ?? 0) + 1}` }
              ]
            })}
          >
            Add option
          </Button>
        </div>
      ) : null}
      {question.type === "RATING" ? (
        <p className="text-sm text-neutral-500">Fixed 1–5 rating scale.</p>
      ) : null}
      <div className="border-t border-neutral-200 pt-5">
        <p className="text-sm font-medium">Conditional Logic</p>
        {sources.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">Add a previous single-choice question first.</p>
        ) : (
          <>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(question.condition)}
                onChange={(event) => {
                  if (!event.target.checked) {
                    onChange({ condition: undefined });
                    return;
                  }
                  const sourceQuestion = sources[0];
                  if (!sourceQuestion) return;
                  onChange({
                    condition: {
                      questionId: sourceQuestion.id,
                      operator: "EQUALS",
                      value: sourceQuestion.options?.[0]?.value ?? ""
                    }
                  });
                }}
              />
              Enable condition
            </label>
            {question.condition ? (
              <div className="mt-3 space-y-3">
                <select
                  className="h-10 w-full rounded-md border border-neutral-300 px-3"
                  value={question.condition.questionId}
                  onChange={(event) => {
                    const nextSource = sources.find((item) => item.id === event.target.value);
                    onChange({
                      condition: {
                        questionId: event.target.value,
                        operator: "EQUALS",
                        value: nextSource?.options?.[0]?.value ?? ""
                      }
                    });
                  }}
                >
                  {sources.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
                <select
                  className="h-10 w-full rounded-md border border-neutral-300 px-3"
                  value={question.condition.value}
                  onChange={(event) => onChange({
                    condition: { ...question.condition!, operator: "EQUALS", value: event.target.value }
                  })}
                >
                  {source?.options?.map((option) => (
                    <option key={option.id} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
