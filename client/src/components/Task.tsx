import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { CalculateRemainingTime } from "../../wailsjs/go/main/App";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { models } from "wailsjs/go/models";
import { DaysLeft } from "./DaysLeft";

type TaskProps = {
  todo: models.Todo;
  onToggle: (id: number) => void;
  openCard: (id: number) => void;
  currentListId?: number;
};

export const Task = ({ todo, onToggle, openCard }: TaskProps) => {
  const [daysLeft, setDaysLeft] = useState<number>();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-${todo.ID}`,
      disabled: todo.Completed,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  const handleChange = () => {
    onToggle(todo.ID);
  };

  const calculateTime = async () => {
    const result = await CalculateRemainingTime(todo.ID);
    console.log("result in calculateTime: ", result);
    setDaysLeft(result);
  };

  useEffect(() => {
    calculateTime();
  });

  return (
    <div
      className="flex gap-3 items-center justify-between ml-6 mr-10 group hover:cursor-pointer"
      ref={setNodeRef}
      style={style}
      onDoubleClick={() => openCard(todo.ID)}
    >
      <div className="flex gap-3 items-center">
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
          className={` ${
            todo.Completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {todo.Name}
        </p>
      </div>
      {!todo.Completed && <DaysLeft difference={daysLeft} />}
    </div>
  );
};
