import { useEffect, useState } from "react";
import { NewTodoCard } from "./NewTodoCard";
import { Todo } from "../types/todo";
import { Task } from "./Task";
import {
  AddTodo,
  GetTodayTodos,
  GetTodosByList,
  UpdateTodo,
  ToggleTodo,
} from "../../wailsjs/go/main/App";
import { NewTaskButton } from "./NewTaskButton";
import { models } from "wailsjs/go/models";
import { useLocation } from "react-router-dom";
import { TodoCard } from "./TaskCard";

type PageProps = {
  title: string;
  id: number;
};

export const Page = ({ title, id }: PageProps) => {
  const [todos, setTodos] = useState<models.Todo[]>([]);
  const [showNewTaskCard, setShowNewTaskCard] = useState<boolean>(false);
  const [openTodoId, setOpenTodoId] = useState<number>();
  const location = useLocation();

  const showCard = () => {
    setShowNewTaskCard(!showNewTaskCard);
  };

  const loadTodos = async () => {
    const result = await GetTodosByList(id);
    setTodos(result);
  };

  const loadTodayTodos = async () => {
    const result = await GetTodayTodos();
    setTodos(result);
  };

  const createTodo = async (
    name: string,
    description: string,
    today: boolean,
    deadline: string,
  ) => {
    await AddTodo(name, description, id, today, deadline);
    loadTodos();
  };

  const updateTodo = async (
    id: number,
    name: string,
    description: string,
    list_id: number,
    today: boolean,
    deadline: string,
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
          : t,
      ),
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
            : t,
        ),
      );
    }
    loadTodos();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showNewTaskCard) {
      e.preventDefault();
      setShowNewTaskCard(false);
    }

    if (e.key === "Escape" && openTodoId !== 0) {
      e.preventDefault();
      setOpenTodoId(0);
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
      e.preventDefault();
      setShowNewTaskCard(true);
    }
  };

  const toggleTodoCard = (id: number) => {
    setOpenTodoId(id);
  };

  useEffect(() => {
    if (location.pathname === "/today") {
      loadTodayTodos();
    } else {
      loadTodos();
    }
  }, [id]);

  // Listen for task move events
  useEffect(() => {
    const handleTaskMoved = () => {
      loadTodos();
    };

    window.addEventListener("taskMoved", handleTaskMoved);
    return () => {
      window.removeEventListener("taskMoved", handleTaskMoved);
    };
  }, []);

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
            {todos.map((todo: models.Todo, index) => (
              <li key={index} className="text-white mb-2">
                {todo.ID !== openTodoId ? (
                  <Task
                    todo={todo}
                    onToggle={handleToggle}
                    currentListId={id}
                    openCard={toggleTodoCard}
                  />
                ) : (
                  <TodoCard UpdateTodoFunction={updateTodo} Task={todo} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <NewTaskButton onClick={showCard} />
    </div>
  );
};
