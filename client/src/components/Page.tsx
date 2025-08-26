import { useEffect, useState } from "react";
import { NewTodoCard } from "./NewTodoCard";
import { Todo } from "../types/todo";
import { Task } from "./Task";
import { AddTodo, GetTodosByList, ToggleTodo } from "../../wailsjs/go/main/App";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

type PageProps = {
  title: string;
  id: number;
};

export const Page = ({ title, id }: PageProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showNewTaskCard, setShowNewTaskCard] = useState<boolean>(false);

  const showCard = () => {
    console.log("Show card!!");
    setShowNewTaskCard(!showNewTaskCard);
  };

  const loadTodos = async () => {
    const result = (await GetTodosByList(id)) as unknown as Todo[];
    setTodos(result);
  };

  const createTodo = async (name: string, description: string) => {
    await AddTodo(name, description, id);
  };

  const handleToggle = async (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.ID === id ? { ...t, Completed: !t.Completed } : t))
    );

    try {
      await ToggleTodo(id);
    } catch (error) {
      console.error(error);
      setTodos((prev) =>
        prev.map((t) => (t.ID === id ? { ...t, Completed: !t.Completed } : t))
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && showNewTaskCard) {
      e.preventDefault();
      setShowNewTaskCard(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [showNewTaskCard]);

  return (
    <div className="flex flex-col h-full relative">
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
      <Button
        onClick={showCard}
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};
