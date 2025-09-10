import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import z from "zod/v3";
import { Card, CardContent } from "./ui/card";
import { FormControl, FormField, FormItem } from "./ui/form";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { models } from "wailsjs/go/models";
import { Flag } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { CalculateRemainingTime } from "../../wailsjs/go/main/App";
import { Deadline } from "./Deadline";

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

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(255).optional(),
});

export const TodoCard = ({ UpdateTodoFunction, Task }: TodoCardProps) => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: Task.Name,
      description: Task.Description,
    },
  });

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const calculateTime = async () => {
    const result = await CalculateRemainingTime(Task.ID);
    console.log("result: ", result);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    UpdateTodoFunction(
      Task.ID,
      values.name,
      values.description || "",
      Task.ListID,
      false,
      date
        ? new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            23,
            59,
            59,
            999
          ).toISOString()
        : ""
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    calculateTime();
  }, []);

  // Focus on input when opening card
  useEffect(() => {
    const nameField = form.getFieldState("name");
    const inputElement = document.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div>
      <Card className="pt-4 mb-3">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Checkbox disabled={true} />
                        <Input
                          placeholder="New Task"
                          onKeyDown={handleKeyDown}
                          {...field}
                          className="border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="mr-3">
                        <Textarea
                          placeholder="Description"
                          {...field}
                          onKeyDown={handleKeyDown}
                          className="border-0 ml-7 focus-visible:ring-0 focus-visible:outline-none shadow-none resize-none"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Button size="icon" onClick={toggleCalendar}>
            <Flag className="w-4" />
          </Button>
          {Task.Deadline && <Deadline taskId={Task.ID} date={Task.Deadline} />}
          {showCalendar && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setShowCalendar(false);
              }}
              className="rounded-lg border"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
