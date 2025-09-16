import { useEffect, useState } from "react";
import { models } from "../../wailsjs/go/models";
import {
  GetArchivedTodosByList,
  GetTodosByList,
  ToggleTodo,
  UpdateTodo,
} from "../../wailsjs/go/main/App";

export const useTodosByList = (list: models.List, isArchived: boolean) => {
  const [todos, setTodos] = useState<models.Todo[]>([]);

  const loadTodos = async () => {
    try {
      const result = isArchived
        ? await GetArchivedTodosByList(list.ID)
        : await GetTodosByList(list.ID);
      setTodos(result);
    } catch (error) {
      console.error("Failed to fetch todo's: ", error);
    }
  };

  const toggleTodo = async (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.ID === id
          ? Object.assign(Object.create(Object.getPrototypeOf(todo)), todo, {
              Completed: !todo.Completed,
            })
          : todo
      )
    );

    try {
      await ToggleTodo(id);
    } catch (error) {
      console.error("Toggle failed, reverting", error);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.ID === id
            ? Object.assign(Object.create(Object.getPrototypeOf(todo)), todo, {
                Completed: !todo.Completed,
              })
            : todo
        )
      );
    }
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

  useEffect(() => {
    loadTodos();
  }, [list.ID, isArchived]);

  return { todos, toggleTodo, updateTodo };
};
