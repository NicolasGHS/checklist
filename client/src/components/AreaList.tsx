import {
  AddList,
  AddListWithArea,
  GetListsByArea,
} from "../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import { SidebarMenuItem } from "./ui/sidebar";
import { ListItem } from "./ListItem";
import { Box } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { models } from "wailsjs/go/models";
import { Plus, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type AreaListProps = {
  areaItem: models.Area;
  deleteList: (id: number) => void;
};

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string(),
});

export const AreaList = ({ areaItem, deleteList }: AreaListProps) => {
  const [lists, setLists] = useState<models.List[]>([]);
  const [hovered, setHovered] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [showNewList, setShowNewList] = useState<boolean>(false);
  const { isOver, setNodeRef } = useDroppable({
    id: `area-${areaItem.ID}`,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const loadLists = async () => {
    const result = await GetListsByArea(areaItem.ID);
    setLists(result);
  };

  const addList = async (values: z.infer<typeof formSchema>) => {
    try {
      await AddListWithArea(values.name, values.description, areaItem.ID);
      loadLists();
    } catch (error) {
      console.error("Failed to add list: ", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showNewList) {
      e.preventDefault();
      setShowNewList(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, [areaItem.ID]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", listener);
  }, [showNewList]);

  return (
    <div className="mb-4 ml-2">
      <div
        ref={setNodeRef}
        className={`transition-colors duration-200 rounded-md p-2 ${
          isOver
            ? "bg-accent/50 border-2 border-dashed border-accent-foreground/20"
            : ""
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Box className="w-4 h-4 mb-1" />
            <p className="font-semibold text-base">{areaItem.Name}</p>
          </div>
          {(hovered || dropdownOpen) && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-6"
                onClick={() => setShowNewList(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger>
                  <Ellipsis className="w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="mt-1 ml-2">
        {showNewList && (
          // <div className="mb-2">
          //   <Input placeholder="New list" />
          // </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addList)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        )}

        {lists.map((list) => (
          <SidebarMenuItem key={list.ID}>
            <ListItem
              list={list}
              onDelete={(id) => {
                deleteList(id);
                // Remove the deleted list from local state
                setLists((prev) => prev.filter((l) => l.ID !== id));
              }}
            />
          </SidebarMenuItem>
        ))}
      </div>
    </div>
  );
};
