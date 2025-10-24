import { useEffect, useState } from "react";
import {
  GetNextSevenDays,
  GetTodosByDeadline,
  ToggleTodo,
  UpdateTodo,
} from "../../wailsjs/go/main/App";
import { formatDateStrings } from "@/utils/dates";
import { Day } from "@/components/Day";
import { models } from "wailsjs/go/models";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

const Upcoming = () => {
  const [days, setDays] = useState<Date[]>();
  const [weekdays, setWeekdays] = useState<[string, string][]>();
  const [todosByDay, setTodosByDay] = useState<{
    [key: string]: models.Todo[];
  }>({});
  const [selectedTodo, setSelectedTodo] = useState<models.Todo | null>(null);

  const getNextDays = async () => {
    const result = await GetNextSevenDays();
    const dates = result.map((t: any) => new Date(t));
    const days = formatDateStrings(dates);
    setDays(dates);
    setWeekdays(days);

    // Fetch todos for each day
    const todosMap: { [key: string]: models.Todo[] } = {};
    for (const date of dates) {
      try {
        const todos = await GetTodosByDeadline(date);
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
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const openCard = (id: number) => {
    const todo = Object.values(todosByDay)
      .flat()
      .find((t) => t.ID === id);
    if (todo) {
      setSelectedTodo(todo);
    }
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

    const newDeadline = new Date(targetDate);
    newDeadline.setHours(0, 0, 0, 0);

    try {
      await UpdateTodo(
        todo.ID,
        todo.Name,
        todo.Description || "",
        todo.ListID,
        todo.Today,
        newDeadline.toISOString()
      );

      await getNextDays();
    } catch (error) {
      console.error("Failed to update todo deadline:", error);
    }
  };

  useEffect(() => {
    getNextDays();
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="mt-10 flex flex-col min-h-full relative">
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
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default Upcoming;
