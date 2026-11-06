import { useEffect, useMemo, useState } from "react";
import { NewTodoCard } from "./NewTodoCard";
import { Task } from "./Task";
import {
  AddTodo,
  DeleteTodo,
  GetLists,
  GetTodayTodos,
  GetTodosByList,
  ReorderListTodos,
  ReorderTodayTodos,
  UpdateTodo,
  ToggleTodo,
} from "bindings/checklist/app";
import { DragEndEvent, useDndMonitor } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { NewTaskButton } from "./NewTaskButton";
import * as models from "bindings/checklist/core/models";
import { useLocation } from "react-router-dom";
import { TodoCard } from "./TaskCard";
import { Button } from "./ui/button";
import { ProjectFilter, ProjectFilterOption } from "./ProjectFilter";
import { endOfDayISO } from "@/utils/dates";

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

  const openTasks = visibleTodos.filter((todo) => !todo.Completed);
  const sortableIds = openTasks
    .filter((todo) => todo.ID !== openTodoId)
    .map((todo) => `task-${todo.ID}`);

  // reorder when a task is dropped on another task of this page; drops on the
  // sidebar are handled in layout.tsx
  const handleReorder = async ({ active, over }: DragEndEvent) => {
    const activeKey = String(active.id);
    const overKey = over ? String(over.id) : "";
    if (activeKey === overKey) return;
    if (!activeKey.startsWith("task-") || !overKey.startsWith("task-")) return;

    const from = todos.findIndex((t) => `task-${t.ID}` === activeKey);
    const to = todos.findIndex((t) => `task-${t.ID}` === overKey);
    if (from < 0 || to < 0) return;

    // move within the full list so tasks hidden by the Today filter keep
    // their place relative to each other
    const reordered = arrayMove(todos, from, to);
    setTodos(reordered);

    const ids = reordered.filter((t) => !t.Completed).map((t) => t.ID);
    try {
      await (isTodayPage ? ReorderTodayTodos(ids) : ReorderListTodos(ids));
    } catch (error) {
      console.error("Failed to save task order:", error);
      reloadTodos();
    }
  };

  useDndMonitor({ onDragEnd: handleReorder });

  const showCard = () => {
    setShowNewTaskCard(!showNewTaskCard);
  };

  const loadTodos = async () => {
    const result = await GetTodosByList(id);
    setTodos(result ?? []);
  };

  const loadTodayTodos = async () => {
    const result = await GetTodayTodos();
    setTodos(result ?? []);
  };

  const reloadTodos = () =>
    location.pathname === "/today" ? loadTodayTodos() : loadTodos();

  const loadListNames = async () => {
    const lists = await GetLists();
    setListNameMap(new Map((lists ?? []).map((l) => [l.ID, l.Name])));
  };

  const createTodo = async (
    name: string,
    description: string,
    today: boolean,
    deadline: string,
  ) => {
    // Today isn't a list: tasks made there go to the Inbox, due today, so they
    // show up on Today and still have a home once the date is removed
    if (isTodayPage) {
      await AddTodo(
        name,
        description,
        INBOX_LIST_ID,
        today,
        deadline || endOfDayISO(new Date()),
      );
    } else {
      await AddTodo(name, description, id, today, deadline);
    }
    // reloads this page and the sidebar counts
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
    // the dragged task stays in the list while dragging (it's sortable), so
    // only a completed move to another list needs a reload
    const handleTaskMoved = () => reload();

    window.addEventListener("taskMoved", handleTaskMoved);
    return () => {
      window.removeEventListener("taskMoved", handleTaskMoved);
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
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            <ul>
              {openTasks.map((todo: models.Todo) => (
                <li key={todo.ID} className="text-white mb-2">
                  {todo.ID !== openTodoId ? (
                    <Task
                      sortable
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
          </SortableContext>
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
