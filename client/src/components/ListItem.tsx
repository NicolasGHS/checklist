import { models } from "../../wailsjs/go/models";
import { Hash } from "lucide-react";
import { Task } from "./Task";
import { TodoCard } from "./TaskCard";
import { Separator } from "./ui/separator";
import { useLocation } from "react-router-dom";
import { useTodosByList } from "@/hooks/useTodosByList";
import { useOpenTodo } from "@/hooks/useOpenTodo";

type ListItemProps = {
  list: models.List;
};

export default function ListItem({ list }: ListItemProps) {
  const location = useLocation();
  const isArchived = location.pathname === "/someday";
  const { todos, toggleTodo, updateTodo } = useTodosByList(list, isArchived);
  const { openTodoId, open, close } = useOpenTodo();

  return (
    <div>
      <div key={list.ID} className="mb-4">
        <div className="flex items-center gap-2">
          <Hash className="w-5" />
          <h1 className="text-xl">{list.Name}</h1>
        </div>
        <Separator className="mr-4" />
        <div className="ml-6 mt-2">
          {todos.map((todo) => (
            <div key={todo.ID}>
              {todo.ID !== openTodoId ? (
                <Task
                  todo={todo}
                  onToggle={toggleTodo}
                  currentListId={list.ID}
                  openCard={open}
                />
              ) : (
                <TodoCard UpdateTodoFunction={updateTodo} Task={todo} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
