import { AddList } from "../../wailsjs/go/main/App";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export const NewListButton = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    AddList(values.name, "");
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            <Plus />
            <p>New List</p>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="new project" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
};
