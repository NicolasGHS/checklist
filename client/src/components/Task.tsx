import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import {
  CalculateRemainingTime,
  DeleteDeadline,
  ScheduleTodo,
} from "bindings/checklist/app";
import { endOfDayISO } from "@/utils/dates";
import {
  DraggableAttributes,
  DraggableSyntheticListeners,
  useDraggable,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, Star, Trash2 } from "lucide-react";
import * as models from "bindings/checklist/core/models";
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
  // inside a SortableContext: the row can be reordered and is a drop target
  sortable?: boolean;
};

type DragBindings = {
  setNodeRef: (node: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  style: React.CSSProperties;
};

export const Task = ({ sortable = false, ...props }: TaskProps) =>
  sortable ? <SortableTask {...props} /> : <DraggableTask {...props} />;

type RowProps = Omit<TaskProps, "sortable">;

const DraggableTask = (props: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-${props.todo.ID}`,
      disabled: props.todo.Completed,
      data: { todo: props.todo },
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <TaskRow {...props} drag={{ setNodeRef, attributes, listeners, style }} />
  );
};

const SortableTask = (props: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${props.todo.ID}`,
    disabled: props.todo.Completed,
    data: { todo: props.todo },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : undefined,
  };
  return (
    <TaskRow {...props} drag={{ setNodeRef, attributes, listeners, style }} />
  );
};

const TaskRow = ({
  todo,
  onToggle,
  openCard,
  onDelete,
  showCompletionDate = false,
  listNameMap,
  drag,
}: RowProps & { drag: DragBindings }) => {
  const [daysLeft, setDaysLeft] = useState<number>();
  const { attributes, listeners, setNodeRef, style } = drag;
  const handleChange = () => {
    onToggle(todo.ID);
  };

  const calculateTime = async () => {
    const result = await CalculateRemainingTime(todo.ID);
    console.log("result in calculateTime: ", result);
    setDaysLeft(result ?? undefined);
  };

  const isToday = typeof daysLeft === "number" && daysLeft <= 0;

  const toggleToday = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isToday) {
        await DeleteDeadline(todo.ID);
        setDaysLeft(undefined);
      } else {
        // due at the end of today; also takes the task out of Someday
        await ScheduleTodo(todo.ID, endOfDayISO(new Date()));
        setDaysLeft(0);
      }
      window.dispatchEvent(new CustomEvent("taskMoved"));
    } catch (error) {
      console.error("Failed toggling today: ", error);
    }
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
  }, [todo.ID, todo.Deadline]);

  return (
    <div
      className="flex gap-3 items-center justify-between ml-6 mr-10 group hover:cursor-pointer select-none"
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
        {!todo.Completed && !isToday && <DaysLeft difference={daysLeft} />}
        {!todo.Completed && (
          <button
            className={`p-1 rounded hover:bg-muted transition-opacity ${
              isToday ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            onClick={toggleToday}
            onDoubleClick={(e) => e.stopPropagation()}
            title={isToday ? "Remove from Today" : "Add to Today"}
          >
            <Star
              className={`w-4 h-4 ${
                isToday
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        )}
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
