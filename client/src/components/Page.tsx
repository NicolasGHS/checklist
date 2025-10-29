import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCount } from "@/hooks/useCount";
import { useTodos } from "@/hooks/useTodos";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { TaskList } from "./Task/TaskList";
import { NewTodoCard } from "./Task/NewTodoCard";
import { NewTaskButton } from "./Task/NewTaskButton";
import { Button } from "./ui/button";

type PageProps = {
  title: string;
  id: number;
};

export const Page = ({ title, id }: PageProps) => {
  const location = useLocation();
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);
  const [openTodoId, setOpenTodoId] = useState<number>(0);
  const { inboxCount, setInboxCount, setTodayCount } = useCount();

  const {
    todos,
    showCompleted,
    setShowCompleted,
    addTodo,
    updateTodo,
    toggleTodo,
  } = useTodos(id, location.pathname);

  const toggleTodoCard = (id: number) => setOpenTodoId(id);

  const handleNewTask = () => setShowNewTaskCard(true);
  const handleCloseTask = () => {
    setShowNewTaskCard(false);
    setOpenTodoId(0);
  };

  useKeyboardShortcuts({
    onNewTask: handleNewTask,
    onCloseTask: handleCloseTask,
  });

  const handleAddTodo = async (
    name: string,
    description: string,
    today: boolean,
    deadline: string
  ) => {
    await addTodo(name, description, today, deadline);
    if (today) setTodayCount((p) => p + 1);
    else if (id === 1) setInboxCount((p) => p + 1);
  };

  return (
    <div className="mt-10 flex flex-col h-full relative">
      <div className="flex-1 p-6">
        <h1 className="text-3xl text-foreground font-bold mb-6">{title}</h1>

        {showNewTaskCard && <NewTodoCard AddTodoFunction={handleAddTodo} />}

        <TaskList
          todos={todos}
          openTodoId={openTodoId}
          toggleTodoCard={toggleTodoCard}
          onToggle={toggleTodo}
          updateTodo={updateTodo}
          currentListId={id}
          completed={false}
        />

        <Button
          variant="ghost"
          className="text-muted-foreground hover:cursor-pointer"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {`${showCompleted ? "Hide" : "Show"} completed tasks`}
        </Button>

        {showCompleted && (
          <TaskList
            todos={todos}
            openTodoId={openTodoId}
            toggleTodoCard={toggleTodoCard}
            onToggle={toggleTodo}
            updateTodo={updateTodo}
            currentListId={id}
            completed={true}
          />
        )}
      </div>
      <NewTaskButton onClick={handleNewTask} />
    </div>
  );
};
