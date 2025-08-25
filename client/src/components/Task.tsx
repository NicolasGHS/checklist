import { useEffect } from "react";
import { Todo } from "../types/todo";
import { Checkbox } from "./ui/checkbox";
import { GetTodoById, ToggleTodo } from "../../wailsjs/go/main/App";

type TaskProps = {
  todo: Todo;
};

export const Task = ({ todo }: TaskProps) => {
  console.log("todo in task: ", todo);

  useEffect(() => {
    const getTodo = async () => {
      const result = await GetTodoById(todo.ID);

      console.log("result of getTodoById: ", result);
    };

    getTodo();
  }, []);

  const handleToggleTodo = async (checked: boolean) => {
    try {
      await ToggleTodo(todo.ID);
      console.log(`Todo ${todo.ID} toggled to: ${checked}`);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <Checkbox checked={todo.Completed} onCheckedChange={handleToggleTodo} />
      <p className="text-foreground">{todo.Name}</p>
      <p>{todo.ID}</p>
    </div>
  );
};
