import { useState } from "react";
import { NewTodoCard } from "./NewTodoCard";
import { Todo } from "../types/todo";
import { Task } from "./Task";
import { AddTodo, ToggleTodo } from "../../wailsjs/go/main/App";
import { NewTaskButton } from "./NewTaskButton";

type PageProps = {
  title: string;
};

export const Page = ({ title }: PageProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showNewTaskCard, setShowNewTaskCard] = useState<boolean>(false);

  const showCard = () => {
    console.log("Show card!!");
    setShowNewTaskCard(!showNewTaskCard);
  };

  const createTodo = async (name: string, description: string) => {
    await AddTodo(name, description, 1);
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

  return (
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
        <NewTaskButton onClick={showCard} />
      </div>
    </div>
  );
};
