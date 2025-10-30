import { useEffect, useState } from "react";
import {
  AddTodo,
  GetTodosByList,
  GetTodayTodos,
  UpdateTodo,
  ToggleTodo,
} from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";

export const useTodos = (listId: number, path: string) => {
  const [todos, setTodos] = useState<models.Todo[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const loadTodos = async () => {
    const result =
      path === "/today" ? await GetTodayTodos() : await GetTodosByList(listId);
    setTodos(result);
  };

  const addTodo = async (
    name: string,
    description: string,
    today: boolean,
    deadline: string
  ) => {
    await AddTodo(name, description, listId, today, deadline);
    await loadTodos();
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
    await loadTodos();
  };

  const toggleTodo = async (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.ID === id
          ? Object.assign(Object.create(Object.getPrototypeOf(t)), t, {
              Completed: !t.Completed,
            })
          : t
      )
    );

    await ToggleTodo(id);
    await loadTodos();
  };

  useEffect(() => {
    loadTodos();
  }, [listId]);

  return {
    todos,
    setTodos,
    showCompleted,
    setShowCompleted,
    loadTodos,
    addTodo,
    updateTodo,
    toggleTodo,
  };
};
