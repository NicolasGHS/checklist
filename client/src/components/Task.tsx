import { useEffect } from "react";
import { Todo } from "../types/todo";
import { Checkbox } from "./ui/checkbox";
import { GetTodoById } from "../../wailsjs/go/main/App";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type TaskProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  currentListId?: number;
};

export const Task = ({ todo, onToggle }: TaskProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-${todo.ID}`,
      disabled: todo.Completed, // Disable dragging for completed tasks
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  const handleChange = () => {
    onToggle(todo.ID);
  };

  return (
    <div
      className="flex gap-3 items-center ml-6 group"
      ref={setNodeRef}
      style={style}
    >
      <GripVertical
        className={`w-4 h-4 transition-opacity ${
          todo.Completed
            ? "text-muted-foreground/50 cursor-not-allowed"
            : "cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100"
        }`}
        {...(!todo.Completed ? listeners : {})}
        {...(!todo.Completed ? attributes : {})}
      />
      <Checkbox checked={todo.Completed} onCheckedChange={handleChange} />
      <p
        className={`flex-1 ${
          todo.Completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {todo.Name}
      </p>
    </div>
  );
};
