import { useEffect, useState } from "react";
import { NewTodoCard } from "./NewTodoCard";
import { Todo } from "../types/todo";
import { Task } from "./Task";
import { AddTodo, GetTodosByList, ToggleTodo } from "../../wailsjs/go/main/App";
import { NewTaskButton } from "./NewTaskButton";

type PageProps = {
  title: string;
  id: number;
};

export const Page = ({ title, id }: PageProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showNewTaskCard, setShowNewTaskCard] = useState<boolean>(false);

  const showCard = () => {
    setShowNewTaskCard(!showNewTaskCard);
  };

  const loadTodos = async () => {
    const result = await GetTodosByList(id);
    setTodos(result);
  };

  const createTodo = async (name: string, description: string) => {
    await AddTodo(name, description, id);
    loadTodos();
  };

  const handleToggle = async (id: number) => {
    console.log("id van todo: ", id);
    setTodos((prev) =>
      prev.map((t) => (t.ID === id ? { ...t, Completed: !t.Completed } : t)),
    );

    try {
      await ToggleTodo(id);
    } catch (error) {
      console.error(error);
      setTodos((prev) =>
        prev.map((t) => (t.ID === id ? { ...t, Completed: !t.Completed } : t)),
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showNewTaskCard) {
      e.preventDefault();
      setShowNewTaskCard(false);
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
      e.preventDefault();
      setShowNewTaskCard(true);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [id]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [showNewTaskCard]);

  return (
    <div className="mt-10 flex flex-col h-full relative">
      <div className="flex-1 p-6">
        <h1 className="text-3xl text-foreground font-bold mb-6">{title}</h1>
        <div>
          {showNewTaskCard && <NewTodoCard AddTodoFunction={createTodo} />}
          <ul>
            {todos.map((todo: Todo, index) => (
              <li key={index} className="text-white mb-2">
                <Task todo={todo} onToggle={handleToggle} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <NewTaskButton onClick={showCard} />
    </div>
  );
};
