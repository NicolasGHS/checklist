import { useEffect } from "react";
import { Todo } from "../types/todo";
import { Checkbox } from "./ui/checkbox";
import { GetTodoById } from "../../wailsjs/go/main/App";

type TaskProps = {
  todo: Todo;
  onToggle: (id: number) => void;
};

export const Task = ({ todo, onToggle }: TaskProps) => {
  const handleChange = () => {
    onToggle(todo.ID);
  };

  return (
    <div className="flex gap-3 items-center">
      <Checkbox checked={todo.Completed} onCheckedChange={handleChange} />
      <p className="text-foreground">{todo.Name}</p>
    </div>
  );
};
