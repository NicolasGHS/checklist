import { Card, CardContent } from "../ui/card";
import { TodoForm, TodoFormValues } from "./TodoForm";
import { DeadlinePicker } from "./DeadlinePicker";
import { useEffect, useState } from "react";
import {
  CalculateRemainingTime,
  DeleteDeadline,
} from "../../../wailsjs/go/main/App";
import { models } from "wailsjs/go/models";
import { SubtasksList } from "./SubTasksList";

type TodoCardProps = {
  UpdateTodoFunction: (
    id: number,
    name: string,
    description: string,
    list_id: number,
    today: boolean,
    deadline: string
  ) => void;
  Task: models.Todo;
};

export const TodoCard = ({ UpdateTodoFunction, Task }: TodoCardProps) => {
  const [daysLeft, setDaysLeft] = useState<number>();

  const calculateTime = async () => {
    const result = await CalculateRemainingTime(Task.ID);
    setDaysLeft(result);
  };

  useEffect(() => {
    calculateTime();
  }, [Task.Deadline]);

  const handleSubmit = (values: TodoFormValues) => {
    UpdateTodoFunction(
      Task.ID,
      values.name,
      values.description || "",
      Task.ListID,
      false,
      ""
    );
  };

  const handleDeadlineSelect = (date: Date) => {
    const newDeadline = new Date(date.setHours(23, 59, 59, 999));
    UpdateTodoFunction(
      Task.ID,
      Task.Name,
      Task.Description,
      Task.ListID,
      false,
      newDeadline.toISOString()
    );
  };

  const handleDeadlineDelete = async () => {
    await DeleteDeadline(Task.ID);
    UpdateTodoFunction(
      Task.ID,
      Task.Name,
      Task.Description,
      Task.ListID,
      false,
      ""
    );
  };

  return (
    <Card className="pt-4 mb-3">
      <CardContent>
        <TodoForm
          defaultValues={{ name: Task.Name, description: Task.Description }}
          onSubmit={handleSubmit}
        />

        <SubtasksList parentId={Task.ID} />

        <DeadlinePicker
          deadline={Task.Deadline ? new Date(Task.Deadline as any) : undefined}
          daysLeft={daysLeft}
          completed={Task.Completed}
          onSelect={handleDeadlineSelect}
          onDelete={handleDeadlineDelete}
        />
      </CardContent>
    </Card>
  );
};
