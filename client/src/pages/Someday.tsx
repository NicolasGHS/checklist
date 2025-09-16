import { useEffect, useState } from "react";
import {
  GetArchivedTodos,
  ToggleTodo,
  UpdateTodo,
} from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import { Task } from "@/components/Task";
import { TodoCard } from "@/components/TaskCard";

export default function Someday() {
  const [todos, setTodos] = useState<models.Todo[]>([]);
  const [openTodoId, setOpenTodoId] = useState<number>();

  const loadTodos = async () => {
    const result = await GetArchivedTodos();
    setTodos(result);
  };

  const toggleTodoCard = (id: number) => {
    setOpenTodoId(id);
  };

  const updateTodo = async (
    id: number,
    name: string,
    description: string,
    list_id: number,
    today: boolean,
    deadline: string
  ) => {
    await UpdateTodo(id, name, description, list_id, today, deadline);
  };

  const handleToggle = async (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.ID === id
          ? Object.assign(Object.create(Object.getPrototypeOf(t)), t, {
              Completed: !t.Completed,
            })
          : t
      )
    );

    try {
      await ToggleTodo(id);
    } catch (error) {
      console.error(error);
      setTodos((prev) =>
        prev.map((t) =>
          t.ID === id
            ? Object.assign(Object.create(Object.getPrototypeOf(t)), t, {
                Completed: !t.Completed,
              })
            : t
        )
      );
    }
    loadTodos();
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="mt-10 flex flex-col min-h-full">
      <h1 className="text-3xl text-foreground font-bold mb-6">Someday</h1>
      {todos
        ?.filter((todo) => !todo.Completed)
        .map((todo) => (
          <li key={todo.ID} className="text-white mb-2">
            {todo.ID !== openTodoId ? (
              <Task
                todo={todo}
                onToggle={handleToggle}
                openCard={toggleTodoCard}
              />
            ) : (
              <TodoCard UpdateTodoFunction={updateTodo} Task={todo} />
            )}
          </li>
        ))}
    </div>
  );
}
