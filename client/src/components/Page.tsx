import { useEffect, useMemo, useState } from "react";
import { NewTodoCard } from "./NewTodoCard";
import { Task } from "./Task";
import {
  AddTodo,
  DeleteTodo,
  GetLists,
  GetTodayTodos,
  GetTodosByList,
  UpdateTodo,
  ToggleTodo,
} from "../../wailsjs/go/main/App";
import { NewTaskButton } from "./NewTaskButton";
import { models } from "wailsjs/go/models";
import { useLocation } from "react-router-dom";
import { TodoCard } from "./TaskCard";
import { Button } from "./ui/button";
import { useCount } from "@/hooks/useCount";
import { ProjectFilter, ProjectFilterOption } from "./ProjectFilter";

const INBOX_LIST_ID = 1;
const TODAY_FILTER_KEY = "todayProjectFilter";

const readTodayFilter = (): number[] => {
  try {
    const raw = localStorage.getItem(TODAY_FILTER_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
};

const writeTodayFilter = (ids: number[]) => {
  try {
    localStorage.setItem(TODAY_FILTER_KEY, JSON.stringify(ids));
  } catch {
    // storage unavailable: the filter just won't persist
  }
};

type PageProps = {
  title: string;
  id: number;
};

export const Page = ({ title, id }: PageProps) => {
  const [todos, setTodos] = useState<models.Todo[]>([]);
  const [showNewTaskCard, setShowNewTaskCard] = useState<boolean>(false);
  const [openTodoId, setOpenTodoId] = useState<number>();
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [listNameMap, setListNameMap] = useState<Map<number, string>>(new Map());
  const [projectFilter, setProjectFilter] = useState<number[]>(readTodayFilter);
  const location = useLocation();
  const { inboxCount, setInboxCount, setTodayCount } = useCount();
  const isTodayPage = location.pathname === "/today";

  const updateProjectFilter = (ids: number[]) => {
    setProjectFilter(ids);
    writeTodayFilter(ids);
  };

  const listName = (listId: number) =>
    listId === INBOX_LIST_ID ? "Inbox" : listNameMap.get(listId);

  // projects that have tasks on Today, plus any still selected in the filter
  const projectOptions = useMemo<ProjectFilterOption[]>(() => {
    if (!isTodayPage) return [];
    const counts = new Map<number, number>();
    for (const todo of todos) {
      if (!counts.has(todo.ListID)) counts.set(todo.ListID, 0);
      if (!todo.Completed) counts.set(todo.ListID, counts.get(todo.ListID)! + 1);
    }
    for (const listId of projectFilter) {
      if (!counts.has(listId)) counts.set(listId, 0);
    }
    return [...counts.entries()]
      .map(([listId, count]) => ({
        id: listId,
        name: listName(listId) ?? "Unknown project",
        count,
      }))
      .sort((a, b) =>
        a.id === INBOX_LIST_ID
          ? -1
          : b.id === INBOX_LIST_ID
            ? 1
            : a.name.localeCompare(b.name),
      );
  }, [isTodayPage, todos, projectFilter, listNameMap]);

  const visibleTodos =
    isTodayPage && projectFilter.length > 0
      ? todos.filter((todo) => projectFilter.includes(todo.ListID))
      : todos;

  const showCard = () => {
    setShowNewTaskCard(!showNewTaskCard);
  };

  const loadTodos = async () => {
    const result = await GetTodosByList(id);
    setTodos(result);
  };

  const loadTodayTodos = async () => {
    const result = await GetTodayTodos();
    setTodos(result);
  };

  const reloadTodos = () =>
    location.pathname === "/today" ? loadTodayTodos() : loadTodos();

  const loadListNames = async () => {
    const lists = await GetLists();
    setListNameMap(new Map(lists.map((l) => [l.ID, l.Name])));
  };

  const createTodo = async (
    name: string,
    description: string,
    today: boolean,
    deadline: string,
  ) => {
    await AddTodo(name, description, id, today, deadline);
    loadTodos();
    if (today) {
      setTodayCount((prev) => prev + 1);
    } else if (id == 1) {
      setInboxCount((prev) => prev + 1);
    }
    // update list counts in the sidebar
    window.dispatchEvent(new CustomEvent("taskMoved"));
  };

  const updateTodo = async (
    id: number,
    name: string,
    description: string,
    list_id: number,
    today: boolean,
    deadline: string,
  ) => {
    await UpdateTodo(id, name, description, list_id, today, deadline);

    if (location.pathname === "/today") {
      loadTodayTodos();
    } else {
      loadTodos();
    }
    // update count
    window.dispatchEvent(new CustomEvent("taskMoved"));
  };

  const handleToggle = async (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.ID === id
          ? Object.assign(Object.create(Object.getPrototypeOf(t)), t, {
              Completed: !t.Completed,
            })
          : t,
      ),
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
            : t,
        ),
      );
    }
    await reloadTodos();
    window.dispatchEvent(new CustomEvent("taskMoved"));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showNewTaskCard) {
      e.preventDefault();
      setShowNewTaskCard(false);
    }

    if (e.key === "Escape" && openTodoId !== 0) {
      e.preventDefault();
      setOpenTodoId(0);
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
      e.preventDefault();
      setShowNewTaskCard(true);
    }
  };

  const handleDelete = async (id: number) => {
    await DeleteTodo(id);
    await reloadTodos();
    window.dispatchEvent(new CustomEvent("taskMoved"));
  };

  const toggleTodoCard = (id: number) => {
    setOpenTodoId(id);
  };

  const toggleShowCompletedTasks = () => {
    setShowCompleted(!showCompleted);
  };

  useEffect(() => {
    if (location.pathname === "/today") {
      loadTodayTodos();
      loadListNames();
    } else {
      loadTodos();
    }
  }, [id]);

  useEffect(() => {
    const reload = () => {
      if (location.pathname === "/today") {
        loadTodayTodos();
      } else {
        loadTodos();
      }
    };
    const handleTaskMoved = () => reload();
    const handleTaskDragStarted = (e: Event) => {
      const { taskId } = (e as CustomEvent).detail;
      setTodos((prev) => prev.filter((t) => t.ID !== taskId));
    };
    const handleTaskDragCancelled = () => reload();

    window.addEventListener("taskMoved", handleTaskMoved);
    window.addEventListener("taskDragStarted", handleTaskDragStarted);
    window.addEventListener("taskDragCancelled", handleTaskDragCancelled);
    return () => {
      window.removeEventListener("taskMoved", handleTaskMoved);
      window.removeEventListener("taskDragStarted", handleTaskDragStarted);
      window.removeEventListener("taskDragCancelled", handleTaskDragCancelled);
    };
  }, [id]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [showNewTaskCard, openTodoId]);

  return (
    <div className="mt-10 flex flex-col h-full relative select-none">
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between gap-4 mb-6 mr-10">
          <h1 className="text-3xl text-foreground font-bold">{title}</h1>
          {isTodayPage && (
            <ProjectFilter
              options={projectOptions}
              selected={projectFilter}
              onChange={updateProjectFilter}
            />
          )}
        </div>
        <div>
          {showNewTaskCard && <NewTodoCard AddTodoFunction={createTodo} />}
          <ul>
            {visibleTodos
              ?.filter((todo) => !todo.Completed)
              .map((todo: models.Todo) => (
                <li key={todo.ID} className="text-white mb-2">
                  {todo.ID !== openTodoId ? (
                    <Task
                      todo={todo}
                      onToggle={handleToggle}
                      currentListId={id}
                      openCard={toggleTodoCard}
                      onDelete={handleDelete}
                      listNameMap={location.pathname === "/today" ? listNameMap : undefined}
                    />
                  ) : (
                    <TodoCard UpdateTodoFunction={updateTodo} Task={todo} />
                  )}
                </li>
              ))}
          </ul>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:cursor-pointer"
            onClick={toggleShowCompletedTasks}
          >
            {`${showCompleted ? "Hide" : "Show"} completed tasks`}
          </Button>
          <ul>
            {showCompleted &&
              visibleTodos
                ?.filter((todo) => todo.Completed)
                .map((todo: models.Todo) => (
                  <li key={todo.ID} className="text-white mb-2">
                    {todo.ID !== openTodoId ? (
                      <Task
                        todo={todo}
                        onToggle={handleToggle}
                        currentListId={id}
                        openCard={toggleTodoCard}
                        listNameMap={location.pathname === "/today" ? listNameMap : undefined}
                      />
                    ) : (
                      <TodoCard UpdateTodoFunction={updateTodo} Task={todo} />
                    )}
                  </li>
                ))}
          </ul>
        </div>
      </div>
      <NewTaskButton onClick={showCard} />
    </div>
  );
};
