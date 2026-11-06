import { useEffect, useState } from "react";
import * as models from "bindings/checklist/core/models";
import {
  DeleteTodo,
  GetArchivedTodosByList,
  GetTodosByList,
  ToggleTodo,
  UpdateTodo,
} from "bindings/checklist/app";

// tell the sidebar counts and other pages that tasks changed
const notifyTaskChanged = () =>
  window.dispatchEvent(new CustomEvent("taskMoved"));

export const useTodosByList = (list: models.List, isArchived: boolean) => {
  const [todos, setTodos] = useState<models.Todo[]>([]);

  const loadTodos = async () => {
    try {
      const result = isArchived
        ? await GetArchivedTodosByList(list.ID)
        : await GetTodosByList(list.ID);
      setTodos(result ?? []);
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
    notifyTaskChanged();
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
    notifyTaskChanged();
  };

  const deleteTodo = async (id: number) => {
    await DeleteTodo(id);
    await loadTodos();
    notifyTaskChanged();
  };

  useEffect(() => {
    loadTodos();

    const handleTaskDragStarted = (e: Event) => {
      const { taskId } = (e as CustomEvent).detail;
      setTodos((prev) => prev.filter((todo) => todo.ID !== taskId));
    };
    const handleTaskDragCancelled = () => loadTodos();
    // a task was dropped elsewhere or changed on another view: the task hidden
    // on drag start must come back (or stay gone) based on the saved data
    const handleTaskMoved = () => loadTodos();

    window.addEventListener("taskDragStarted", handleTaskDragStarted);
    window.addEventListener("taskDragCancelled", handleTaskDragCancelled);
    window.addEventListener("taskMoved", handleTaskMoved);
    return () => {
      window.removeEventListener("taskDragStarted", handleTaskDragStarted);
      window.removeEventListener("taskDragCancelled", handleTaskDragCancelled);
      window.removeEventListener("taskMoved", handleTaskMoved);
    };
  }, [list.ID, isArchived]);

  return { todos, toggleTodo, updateTodo, deleteTodo };
};
