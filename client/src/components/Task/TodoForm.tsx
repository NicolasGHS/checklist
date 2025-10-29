import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";

const formSchema = z.object({
  name: z.string().min(0).max(128),
  description: z.string().max(255).optional(),
});

export type TodoFormValues = z.infer<typeof formSchema>;

type TodoFormProps = {
  defaultValues: TodoFormValues;
  onSubmit: (values: TodoFormValues) => void;
  onEnterSubmit?: boolean;
};

export const TodoForm = ({
  defaultValues,
  onSubmit,
  onEnterSubmit = true,
}: TodoFormProps) => {
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onEnterSubmit && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Checkbox disabled />
                  <Input
                    placeholder="New Task"
                    {...field}
                    onKeyDown={handleKeyDown}
                    className="border-0 focus-visible:ring-0 shadow-none"
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
                <Textarea
                  placeholder="Description"
                  {...field}
                  onKeyDown={handleKeyDown}
                  className="border-0 ml-7 focus-visible:ring-0 shadow-none resize-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
