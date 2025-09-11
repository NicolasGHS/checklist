import { AddList, AddArea } from "../../wailsjs/go/main/App";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Plus } from "lucide-react";
import { Separator } from "./ui/separator";

type NewListProps = {
  addArea: () => void;
  addList: () => void;
  showAreaCreation: boolean;
  showListCreation: boolean;
  closeAreaCreation: () => void;
  closeListCreation: () => void;
  reloadData: () => void;
};

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export const NewListButton = ({
  addArea,
  addList,
  showAreaCreation,
  showListCreation,
  closeAreaCreation,
  closeListCreation,
  reloadData,
}: NewListProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    AddList(values.name, "").then(() => {
      form.reset();
      closeListCreation();
      reloadData();
    });
  }

  function onAreaSubmit(values: z.infer<typeof formSchema>) {
    AddArea(values.name).then(() => {
      form.reset();
      closeAreaCreation();
      reloadData();
    });
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className="flex items-center gap-2 pl-1 pr-2 pt-1 pb-1  rounded hover:bg-background_hover">
            <Plus className="w-5" />
            <p>New List</p>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          {!showAreaCreation && !showListCreation ? (
            <>
              <Button variant="ghost" onClick={addList}>
                New Project
              </Button>
              <Separator className="mt-2 mb-2" />
              <Button variant="ghost" onClick={addArea}>
                New Area
              </Button>
            </>
          ) : null}

          {showListCreation && (
            <div>
              <h3 className="mb-2 font-semibold">Create New Project</h3>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Project name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Create
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={closeListCreation}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {showAreaCreation && (
            <div>
              <h3 className="mb-2 font-semibold">Create New Area</h3>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onAreaSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Area name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Create
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={closeAreaCreation}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
