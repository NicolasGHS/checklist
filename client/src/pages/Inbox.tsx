import React, { useEffect, useState } from "react";
import { AddTodo, GetTodos } from "../../wailsjs/go/main/App";
import { Task } from "../components/Task";
import { Todo } from "../types/todo";

const Inbox: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = async () => {
    const todoList = (await GetTodos()) as unknown as Todo[];

    console.log("todoList: ", todoList);

    setTodos(todoList);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl text-foreground font-bold mb-6">Inbox</h1>
      {todos.length === 0 ? (
        <p>Geen todo's gevonden.</p>
      ) : (
        <ul>
          {todos.map((todo: Todo, index) => (
            <li key={index} className="text-white mb-2">
              {/* <span className={todo.Completed ? "line-through" : ""}>
                {todo.Name} - {todo.Description}
              </span> */}
              <Task todo={todo} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
