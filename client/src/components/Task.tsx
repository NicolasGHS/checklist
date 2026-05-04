import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { CalculateRemainingTime } from "../../wailsjs/go/main/App";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, Trash2 } from "lucide-react";
import { models } from "wailsjs/go/models";
import { DaysLeft } from "./DaysLeft";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type TaskProps = {
  todo: models.Todo;
  onToggle: (id: number) => void;
  openCard: (id: number) => void;
  onDelete?: (id: number) => void;
  currentListId?: number;
  showCompletionDate?: boolean;
  listNameMap?: Map<number, string>;
};

export const Task = ({
  todo,
  onToggle,
  openCard,
  onDelete,
  showCompletionDate = false,
  listNameMap,
}: TaskProps) => {
  const [daysLeft, setDaysLeft] = useState<number>();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-${todo.ID}`,
      disabled: todo.Completed,
      data: {
        todo,
      },
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

  const formatCompletionDate = (completedAt: any) => {
    if (!completedAt) return "";
    const date = new Date(completedAt);
    const day = date.getDate();
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toLowerCase();
    return `${day} ${month}`;
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
        {showCompletionDate && todo.CompletedAt && (
          <span className="text-sm text-muted-foreground min-w-[60px]">
            {formatCompletionDate(todo.CompletedAt)}
          </span>
        )}
        <p
          className={` ${
            todo.Completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {todo.Name}
        </p>
        {listNameMap && listNameMap.get(todo.ListID) && (
          <span
            className="text-sm text-muted-foreground truncate max-w-[120px]"
            title={listNameMap.get(todo.ListID)}
          >
            {listNameMap.get(todo.ListID)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!todo.Completed && <DaysLeft difference={daysLeft} />}
        {onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo.ID);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
