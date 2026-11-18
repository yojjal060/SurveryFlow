import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Question } from "@survey-builder/shared";
import { SortableQuestion } from "@/features/survey-builder/SortableQuestion";

export function QuestionList({
  questions,
  selectedId,
  onSelect,
  onDelete,
  onReorder
}: {
  questions: Question[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (questions: Question[]) => void;
}) {
  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((question) => question.id === active.id);
    const newIndex = questions.findIndex((question) => question.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) onReorder(arrayMove(questions, oldIndex, newIndex));
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={dragEnd}>
      <SortableContext items={questions.map((question) => question.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {questions.map((question) => (
            <SortableQuestion
              key={question.id}
              question={question}
              selected={selectedId === question.id}
              onSelect={() => onSelect(question.id)}
              onDelete={() => onDelete(question.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
