import React, { useEffect, useState } from "react";
import {
  AddTodo,
  GetTodos,
  ToggleTodo,
  GetInboxTasks,
} from "../../wailsjs/go/main/App";
import { Task } from "../components/Task";
import { Todo } from "../types/todo";

const Inbox: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = async () => {
    const todoList = (await GetInboxTasks()) as unknown as Todo[];
    setTodos(todoList);
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

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl text-foreground font-bold mb-6">Inbox</h1>
      {todos.length === 0 ? (
        <p>Geen todo's gevonden.</p>
      ) : (
        <ul>
          {todos.map((todo: Todo, index) => (
            <li key={index} className="text-white mb-2">
              <Task todo={todo} onToggle={handleToggle} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
