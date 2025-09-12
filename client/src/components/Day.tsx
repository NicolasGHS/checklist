import { Separator } from "./ui/separator";
import { Task } from "./Task";
import { models } from "wailsjs/go/models";

type DayProps = {
  dayNumber: string;
  weekday: string;
  todos?: models.Todo[];
  onToggle: (id: number) => void;
  openCard: (id: number) => void;
};

export const Day = ({
  dayNumber,
  weekday,
  todos = [],
  onToggle,
  openCard,
}: DayProps) => {
  return (
    <div className="flex gap-2 min-h-28">
      <p className="text-2xl">{dayNumber}</p>
      <div className="w-full flex flex-col items-start mr-3">
        <Separator />
        <p className="text-muted-foreground mb-2">{weekday}</p>
        <div className="w-full space-y-1">
          {todos.map((todo) => (
            <Task
              key={todo.ID}
              todo={todo}
              onToggle={onToggle}
              openCard={openCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
