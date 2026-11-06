import { useEffect, useState } from "react";
import {
  DeleteTodo,
  GetNextSevenDays,
  GetTodosByDeadline,
  ScheduleTodo,
  ToggleTodo,
  UpdateTodo,
} from "bindings/checklist/app";
import { endOfDayISO, formatDateStrings } from "@/utils/dates";
import { useOpenTodo } from "@/hooks/useOpenTodo";
import { Day } from "@/components/Day";
import * as models from "bindings/checklist/core/models";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

const Upcoming = () => {
  const [days, setDays] = useState<Date[]>();
  const [weekdays, setWeekdays] = useState<[string, string][]>();
  const [todosByDay, setTodosByDay] = useState<{
    [key: string]: models.Todo[];
  }>({});
  // Escape closes the open card (handled in the hook)
  const { openTodoId, open: openCard } = useOpenTodo();

  const getNextDays = async () => {
    const result = await GetNextSevenDays();
    const dates = (result ?? []).map((t: any) => new Date(t));
    const days = formatDateStrings(dates);
    setDays(dates);
    setWeekdays(days);

    // Fetch todos for each day
    const todosMap: { [key: string]: models.Todo[] } = {};
    for (const date of dates) {
      try {
        const todos = (await GetTodosByDeadline(date.toISOString())) ?? [];
        // Use local date components to avoid timezone shifts
        const dateKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        todosMap[dateKey] = todos;
      } catch (error) {
        console.error(`Failed to fetch todos for ${date}:`, error);
        const dateKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        todosMap[dateKey] = [];
      }
    }
    setTodosByDay(todosMap);
  };

  const handleToggle = async (id: number) => {
    try {
      await ToggleTodo(id);
      getNextDays();
      window.dispatchEvent(new CustomEvent("taskMoved"));
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleDelete = async (id: number) => {
    await DeleteTodo(id);
    getNextDays();
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
    await getNextDays();
    window.dispatchEvent(new CustomEvent("taskMoved"));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current) {
      return;
    }

    const todo = active.data.current.todo as models.Todo;
    const targetDayNumber = over.id as string;

    const targetDate = days?.find((date, index) => {
      const dayInfo = weekdays?.[index];
      return dayInfo && dayInfo[0] === targetDayNumber;
    });

    if (!targetDate) {
      console.error("Could not find target date for day:", targetDayNumber);
      return;
    }

    try {
      // end of the target day, like every other deadline; local midnight is
      // stored as the previous day in UTC and lands in the wrong bucket
      await ScheduleTodo(todo.ID, endOfDayISO(targetDate));

      await getNextDays();
      window.dispatchEvent(new CustomEvent("taskMoved"));
    } catch (error) {
      console.error("Failed to update todo deadline:", error);
    }
  };

  useEffect(() => {
    getNextDays();

    // e.g. a task starred or dropped on a sidebar view from here
    const handleTaskMoved = () => getNextDays();
    window.addEventListener("taskMoved", handleTaskMoved);
    return () => window.removeEventListener("taskMoved", handleTaskMoved);
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="mt-10 flex flex-col min-h-full relative select-none">
        <h1 className="text-3xl text-foreground font-bold mb-6">Upcoming</h1>
        {weekdays?.map((day, index) => {
          const date = days?.[index];
          const dateKey = date
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(date.getDate()).padStart(2, "0")}`
            : "";
          const todosForDay = todosByDay[dateKey] || [];

          return (
            <Day
              dayNumber={day[0]}
              weekday={day[1]}
              key={index}
              todos={todosForDay}
              onToggle={handleToggle}
              openCard={openCard}
              onDelete={handleDelete}
              openTodoId={openTodoId}
              onUpdate={updateTodo}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default Upcoming;
