import React, { useEffect, useState } from "react";
import {
  AddTodo,
  GetTodos,
  ToggleTodo,
  GetInboxTasks,
} from "../../wailsjs/go/main/App";
import { Task } from "../components/Task";
import { Todo } from "../types/todo";
import { NewTodoCard } from "../components/NewTodoCard";
import { NewTaskButton } from "../components/NewTaskButton";

const Inbox: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showNewTaskCard, setShowNewTaskCard] = useState<boolean>(false);

  const showCard = () => {
    console.log("Show card!!");
    setShowNewTaskCard(!showNewTaskCard);
  };

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

  const createTodo = async (name: string, description: string) => {
    await AddTodo(name, description, 1);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl text-foreground font-bold mb-6">Inbox</h1>
      {todos.length === 0 ? (
        <p>No todo's yet.</p>
      ) : (
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
      )}
    </div>
  );
};

export default Inbox;
