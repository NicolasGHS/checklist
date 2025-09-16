import { useEffect, useState } from "react";
import {
  GetArchivedTodos,
  GetListsWithArchivedTodos,
  ToggleTodo,
  UpdateTodo,
} from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import ListItem from "@/components/ListItem";

export default function Someday() {
  const [todos, setTodos] = useState<models.Todo[]>([]);
  const [lists, setLists] = useState<models.List[]>([]);
  const [openTodoId, setOpenTodoId] = useState<number>();

  const loadTodos = async () => {
    const result = await GetArchivedTodos();
    setTodos(result);
  };

  const loadLists = async () => {
    const result = await GetListsWithArchivedTodos();
    setLists(result);
  };

  const toggleTodoCard = (id: number) => {
    setOpenTodoId(id);
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
  };

  const handleToggle = async (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.ID === id
          ? Object.assign(Object.create(Object.getPrototypeOf(t)), t, {
              Completed: !t.Completed,
            })
          : t
      )
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
            : t
        )
      );
    }
    loadTodos();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && openTodoId !== 0) {
      e.preventDefault();
      setOpenTodoId(0);
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [openTodoId]);

  useEffect(() => {
    loadTodos();
    loadLists();
  }, []);

  return (
    <div className="mt-10 flex flex-col min-h-full">
      <h1 className="text-3xl text-foreground font-bold mb-6">Someday</h1>
      {lists?.map((list, index) => (
        <ListItem list={list} key={index} />
      ))}
    </div>
  );
}
