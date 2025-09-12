import { useEffect, useState } from "react";
import {
  GetNextSevenDays,
  GetTodosByDeadline,
  ToggleTodo,
} from "../../wailsjs/go/main/App";
import { formatDateStrings } from "@/utils/dates";
import { Day } from "@/components/Day";
import { models } from "wailsjs/go/models";

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
        const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format
        todosMap[dateKey] = todos;
      } catch (error) {
        console.error(`Failed to fetch todos for ${date}:`, error);
        const dateKey = date.toISOString().split("T")[0];
        todosMap[dateKey] = [];
      }
    }
    setTodosByDay(todosMap);
  };

  const handleToggle = async (id: number) => {
    try {
      await ToggleTodo(id);
      // Refresh todos after toggling
      getNextDays();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const openCard = (id: number) => {
    // Find the todo with the given id
    const todo = Object.values(todosByDay)
      .flat()
      .find((t) => t.ID === id);
    if (todo) {
      setSelectedTodo(todo);
    }
  };

  useEffect(() => {
    getNextDays();
  }, []);

  return (
    <div className="mt-10 flex flex-col h-full relative">
      <h1 className="text-3xl text-foreground font-bold mb-6">Upcoming</h1>
      {weekdays?.map((day, index) => {
        const date = days?.[index];
        const dateKey = date?.toISOString().split("T")[0] || "";
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
  );
};

export default Upcoming;
