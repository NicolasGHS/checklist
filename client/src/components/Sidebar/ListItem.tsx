import { Link, useLocation } from "react-router-dom";
import { SidebarMenuButton } from "../ui/sidebar";
import { Ellipsis, Hash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GetListCount } from "bindings/checklist/app";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import * as models from "bindings/checklist/core/models";
import { buttonVariants } from "@/components/ui/button";

type ListItemProps = {
  list: models.List;
  // deleteTasks false = move the list's tasks to the Inbox
  onDelete: (id: number, deleteTasks: boolean) => void;
};

export const ListItem = ({ list, onDelete }: ListItemProps) => {
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `list-${list.ID}`,
    });

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: `drop-list-${list.ID}`,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const getCount = async () => {
    const result = await GetListCount(list.ID);
    setCount(result);
  };

  useEffect(() => {
    getCount();

    window.addEventListener("taskMoved", getCount);
    return () => {
      window.removeEventListener("taskMoved", getCount);
    };
  }, [list.ID]);

  const truncate = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <SidebarMenuButton
      asChild
      isActive={
        location.pathname === `/list/${list.Slug}` ||
        (location.pathname === "/" && list.Slug === "inbox")
      }
    >
      <div
        className={`flex items-center justify-between transition-all duration-200 rounded-md ${
          isOver
            ? "bg-accent/50 border-2 border-dashed border-primary/50 p-1 scale-105"
            : "hover:bg-accent/20"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={(node) => {
          setNodeRef(node);
          setDroppableNodeRef(node);
        }}
        style={style}
      >
        <Link to={`list/${list.Slug}`} className="flex-1 py-1 min-w-0">
          <span className="flex items-center gap-2 min-w-0">
            <Hash
              className="w-4 h-4 flex-shrink-0 cursor-grab active:cursor-grabbing"
              {...listeners}
              {...attributes}
            />
            <span className="truncate">{truncate(list.Name, 20)}</span>
          </span>
        </Link>

        <div className="relative flex items-center justify-end min-w-4">
          {count > 0 && (
            <p
              className={`transition-opacity duration-200 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              {count}
            </p>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute right-0">
              <Ellipsis
                className={`w-4 transition-opacity duration-200 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="hover:cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete “{list.Name}”?</AlertDialogTitle>
              <AlertDialogDescription>
                {count > 0
                  ? `This list has ${count} open ${count === 1 ? "task" : "tasks"}. Move its tasks to the Inbox, or delete them along with the list. This can't be undone.`
                  : "Any completed tasks in it move to the Inbox and stay in the Logbook. This can't be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              {count > 0 && (
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => onDelete(list.ID, true)}
                >
                  Delete list and tasks
                </AlertDialogAction>
              )}
              <AlertDialogAction onClick={() => onDelete(list.ID, false)}>
                {count > 0 ? "Move tasks to Inbox" : "Delete list"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarMenuButton>
  );
};
