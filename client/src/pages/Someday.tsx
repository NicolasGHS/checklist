import { useEffect, useState } from "react";
import { GetArchivedTodos } from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";

export default function Someday() {
  const [todos, setTodos] = useState<models.Todo[]>([]);

  const loadTodos = async () => {
    const result = await GetArchivedTodos();
    setTodos(result);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="mt-10 flex flex-col min-h-full">
      <h1 className="text-3xl text-foreground font-bold mb-6">Someday</h1>
      {todos.map((todo) => (
        <p>{todo.Name}</p>
      ))}
    </div>
  );
}
