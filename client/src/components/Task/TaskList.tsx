import { models } from "wailsjs/go/models";
import { Task } from "./Task";
import { TodoCard } from "./TaskCard";

type TaskListProps = {
  todos: models.Todo[];
  openTodoId?: number;
  toggleTodoCard: (id: number) => void;
  onToggle: (id: number) => void;
  updateTodo: (
    id: number,
    name: string,
    description: string,
    list_id: number,
    today: boolean,
    deadline: string
  ) => void;
  currentListId: number;
  completed?: boolean;
};

export const TaskList = ({
  todos,
  openTodoId,
  toggleTodoCard,
  onToggle,
  updateTodo,
  currentListId,
  completed = false,
}: TaskListProps) => (
  <ul>
    {todos
      ?.filter((t) => t.Completed === completed)
      .map((todo) => (
        <li key={todo.ID} className="mb-2 text-white">
          {todo.ID !== openTodoId ? (
            <Task
              todo={todo}
              onToggle={onToggle}
              currentListId={currentListId}
              openCard={toggleTodoCard}
            />
          ) : (
            <TodoCard UpdateTodoFunction={updateTodo} Task={todo} />
          )}
        </li>
      ))}
  </ul>
);
