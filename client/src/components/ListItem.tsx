import { useEffect, useState } from "react";
import {
  GetLists,
  GetTodosByList,
  UpdateTodo,
  ToggleTodo,
} from "../../wailsjs/go/main/App";
import { models } from "wailsjs/go/models";
import { Hash } from "lucide-react";
import { Task } from "./Task";
import { TodoCard } from "./TaskCard";

export default function ListItem() {
  const [lists, setLists] = useState<models.List[]>([]);
  const [todosByList, setTodosByList] = useState<Record<number, models.Todo[]>>(
    {}
  );
  const [openTodoId, setOpenTodoId] = useState<number>();

  const loadLists = async () => {
    try {
      const result = await GetLists();
      setLists(result);

      for (const list of result) {
        await loadTodos(list.ID);
      }
    } catch (error) {
      console.error("Failed to fetch lists", error);
    }
  };

  const loadTodos = async (listID: number) => {
    try {
      const result = await GetTodosByList(listID);
      setTodosByList((prev) => ({
        ...prev,
        [listID]: result,
      }));
    } catch (error) {
      console.error("Failed to fetch todo's: ", error);
    }
  };

  const handleToggle = async (id: number) => {
    let listIdWithTodo: number | undefined = undefined;
    for (const [listId, todos] of Object.entries(todosByList)) {
      if (todos.some((t) => t.ID === id)) {
        listIdWithTodo = Number(listId);
        break;
      }
    }
    if (listIdWithTodo === undefined) return;

    setTodosByList((prev) => {
      const todos = prev[listIdWithTodo!].map((t) =>
        t.ID === id
          ? Object.assign(Object.create(Object.getPrototypeOf(t)), t, {
              Completed: !t.Completed,
            })
          : t
      );
      return { ...prev, [listIdWithTodo!]: todos };
    });

    try {
      await ToggleTodo(id);
    } catch (error) {
      console.error(error);
      setTodosByList((prev) => {
        const todos = prev[listIdWithTodo!].map((t) =>
          t.ID === id
            ? Object.assign(Object.create(Object.getPrototypeOf(t)), t, {
                Completed: !t.Completed,
              })
            : t
        );
        return { ...prev, [listIdWithTodo!]: todos };
      });
    }
    await loadTodos(listIdWithTodo);
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
    // Reload todos after update
    for (const list of lists) {
      await loadTodos(list.ID);
    }
  };

  const toggleTodoCard = (id: number) => {
    setOpenTodoId(id);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && openTodoId) {
      e.preventDefault();
      setOpenTodoId(undefined);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [openTodoId]);

  return (
    <div>
      {lists.map((list) => (
        <div key={list.ID} className="mb-4">
          <div className="flex items-center gap-2">
            <Hash className="w-5" />
            <h1 className="text-xl">{list.Name}</h1>
          </div>

          <div className="ml-6 mt-2">
            {(todosByList[list.ID] ?? []).map((todo) => (
              <div key={todo.ID}>
                {todo.ID !== openTodoId ? (
                  <Task
                    todo={todo}
                    onToggle={handleToggle}
                    currentListId={list.ID}
                    openCard={toggleTodoCard}
                  />
                ) : (
                  <TodoCard UpdateTodoFunction={updateTodo} Task={todo} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
