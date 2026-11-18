import { Button } from "@/components/ui/button";
import type { QuestionType } from "@survey-builder/shared";

export function QuestionToolbar({ onAdd }: { onAdd: (type: QuestionType) => void }) {
  const types: { type: QuestionType; label: string }[] = [
    { type: "TEXT", label: "Text" },
    { type: "SINGLE_CHOICE", label: "Single choice" },
    { type: "MULTIPLE_CHOICE", label: "Checkbox" },
    { type: "RATING", label: "Rating" }
  ];
  return (
    <aside className="space-y-2">
      <p className="px-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Add question</p>
      {types.map(({ type, label }) => (
        <Button
          key={type}
          type="button"
          className="w-full justify-start border border-neutral-200 bg-white text-neutral-900"
          onClick={() => onAdd(type)}
        >
          {label}
        </Button>
      ))}
    </aside>
  );
}
