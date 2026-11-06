import { Separator } from "./ui/separator";
import { Task } from "./Task";
import { TodoCard } from "./TaskCard";
import * as models from "bindings/checklist/core/models";
import { useDroppable } from "@dnd-kit/core";

type DayProps = {
  dayNumber: string;
  weekday: string;
  todos?: models.Todo[];
  onToggle: (id: number) => void;
  openCard: (id: number) => void;
  onDelete?: (id: number) => void;
  // task shown expanded as an editable card instead of a row
  openTodoId?: number;
  onUpdate: (
    id: number,
    name: string,
    description: string,
    list_id: number,
    today: boolean,
    deadline: string,
  ) => Promise<void>;
};

export const Day = ({
  dayNumber,
  weekday,
  todos = [],
  onToggle,
  openCard,
  onDelete,
  openTodoId,
  onUpdate,
}: DayProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: dayNumber,
  });

  return (
    <div
      className={`flex gap-2 min-h-28 transition-colors ${
        isOver ? "bg-muted/50 rounded-lg" : ""
      }`}
      ref={setNodeRef}
    >
      <p className="text-2xl">{dayNumber}</p>
      <div className="w-full flex flex-col items-start mr-3">
        <Separator />
        <p className="text-muted-foreground mb-2">{weekday}</p>
        <div className="w-full space-y-1">
          {todos.map((todo) =>
            todo.ID === openTodoId ? (
              <TodoCard key={todo.ID} UpdateTodoFunction={onUpdate} Task={todo} />
            ) : (
              <Task
                key={todo.ID}
                todo={todo}
                onToggle={onToggle}
                openCard={openCard}
                onDelete={onDelete}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};
