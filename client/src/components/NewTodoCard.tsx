import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";

type NewTodoCardProps = {
  AddTodoFunction: (
    name: string,
    description: string,
    today: boolean,
    deadline: string
  ) => void;
};

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(255).optional(),
});

export const NewTodoCard = ({ AddTodoFunction }: NewTodoCardProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    AddTodoFunction(values.name, values.description || "", false, ""); // TODO: deadline functionality
    form.reset({
      name: "",
      description: "",
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

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
        </CardContent>
      </Card>
    </div>
  );
};
