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
  const [task, setTask] = useState(Task);
  const [daysLeft, setDaysLeft] = useState<number>();

  const calculateTime = async () => {
    const result = await CalculateRemainingTime(task.ID);
    setDaysLeft(result);
  };

  useEffect(() => {
    calculateTime();
  }, [task.Deadline]);

  const handleSubmit = (values: TodoFormValues) => {
    UpdateTodoFunction(
      task.ID,
      values.name,
      values.description || "",
      task.ListID,
      false,
      ""
    );
  };

  const handleDeadlineSelect = (date: Date) => {
    const newDeadline = new Date(date.setHours(23, 59, 59, 999));
    UpdateTodoFunction(
      task.ID,
      task.Name,
      task.Description,
      task.ListID,
      false,
      newDeadline.toISOString()
    );
  };

  const handleDeadlineDelete = async () => {
    const result = await DeleteDeadline(task.ID);
    setTask(result);
    UpdateTodoFunction(
      task.ID,
      task.Name,
      task.Description,
      task.ListID,
      false,
      ""
    );
  };

  return (
    <Card className="pt-4 mb-3">
      <CardContent>
        <TodoForm
          defaultValues={{ name: task.Name, description: task.Description }}
          onSubmit={handleSubmit}
        />

        <SubtasksList parentId={task.ID} />

        <DeadlinePicker
          deadline={task.Deadline ? new Date(task.Deadline as any) : undefined}
          daysLeft={daysLeft}
          completed={task.Completed}
          onSelect={handleDeadlineSelect}
          onDelete={handleDeadlineDelete}
        />
      </CardContent>
    </Card>
  );
};
