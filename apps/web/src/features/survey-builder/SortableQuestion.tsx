import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Question } from "@survey-builder/shared";

export function SortableQuestion({
  question,
  selected,
  onSelect,
  onDelete
}: {
  question: Question;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id });

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-lg border bg-white p-4 ${selected ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200"} ${isDragging ? "opacity-60" : ""}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="cursor-grab rounded px-1 py-1 text-neutral-400"
          aria-label="Drag question"
          {...attributes}
          {...listeners}
        >
          ::
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-500">{question.type.replaceAll("_", " ")}</p>
          <h3 className="mt-1 font-medium">{question.title}</h3>
          {question.description ? <p className="mt-1 text-sm text-neutral-500">{question.description}</p> : null}
          {question.type === "TEXT" ? (
            question.multiline
              ? <div className="mt-3 h-20 rounded-md border border-neutral-200 bg-neutral-50" />
              : <div className="mt-3 h-9 rounded-md border border-neutral-200 bg-neutral-50" />
          ) : null}
          {question.type === "SINGLE_CHOICE" || question.type === "MULTIPLE_CHOICE" ? (
            <div className="mt-3 space-y-2">
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className={`h-4 w-4 border border-neutral-300 ${question.type === "MULTIPLE_CHOICE" ? "rounded" : "rounded-full"}`} />
                  {option.label}
                </div>
              ))}
            </div>
          ) : null}
          {question.type === "RATING" ? (
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <span key={value} className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-sm">{value}</span>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="text-sm text-red-600"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
