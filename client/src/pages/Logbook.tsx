import { useEffect, useState } from "react";
import { GetCompletedTodos, ToggleTodo } from "../../wailsjs/go/main/App";
import { models } from "wailsjs/go/models";
import { Task } from "../components/Task";

interface GroupedTodos {
  [key: string]: models.Todo[];
}

export const LogBook = () => {
  const [completedTodos, setCompletedTodos] = useState<models.Todo[]>([]);
  const [groupedTodos, setGroupedTodos] = useState<GroupedTodos>({});

  const fetchCompletedTodos = async () => {
    try {
      const todos = await GetCompletedTodos();
      setCompletedTodos(todos);
      groupTodosByMonth(todos);
    } catch (error) {
      console.error("Failed to fetch completed todos:", error);
    }
  };

  const groupTodosByMonth = (todos: models.Todo[]) => {
    const grouped: GroupedTodos = {};

    todos.forEach((todo) => {
      if (todo.CompletedAt) {
        const date = new Date(todo.CompletedAt as any);
        const monthYear = date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(todo);
      }
    });

    setGroupedTodos(grouped);
  };

  const handleToggle = async (id: number) => {
    try {
      await ToggleTodo(id);
      fetchCompletedTodos();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  // TODO: open card functionality
  const handleOpenCard = (id: number) => {
    console.log("Opening todo card:", id);
  };

  useEffect(() => {
    fetchCompletedTodos();
  }, []);

  return (
    <div className="mt-10 flex flex-col min-h-full">
      <h1 className="text-3xl text-foreground font-bold mb-6">Logbook</h1>

      {Object.keys(groupedTodos).length === 0 ? (
        <p className="text-muted-foreground ml-6">No completed tasks yet.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedTodos).map(([monthYear, todos]) => (
            <div key={monthYear} className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground ml-6">
                {monthYear}
              </h2>
              <div className="space-y-2">
                {todos.map((todo) => (
                  <Task
                    key={todo.ID}
                    todo={todo}
                    onToggle={handleToggle}
                    openCard={handleOpenCard}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
