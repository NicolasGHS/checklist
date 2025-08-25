import React, { useEffect, useState } from "react";
import { AddTodo, GetTodos } from "../../wailsjs/go/main/App";
import { Task } from "../components/Task";

type Todo = {
  Name: string;
  Description: string;
  Completed: boolean;
};

const Inbox: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      const todoList = (await GetTodos()) as unknown as Todo[];

      console.log("todoList: ", todoList);

      setTodos(todoList);
    };

    loadTodos();
  }, []);

  console.log("todos: ", todos);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Inbox</h1>
      {todos.length === 0 ? (
        <p className="text-white">Geen todo's gevonden.</p>
      ) : (
        <ul>
          {todos.map((todo, index) => (
            <li key={index} className="text-white mb-2">
              {/* <span className={todo.Completed ? "line-through" : ""}>
                {todo.Name} - {todo.Description}
              </span> */}
              <Task name={todo.Name} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
