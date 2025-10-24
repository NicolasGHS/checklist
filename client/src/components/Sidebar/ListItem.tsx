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
import { useState } from "react";
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
import { DeleteList } from "../../../wailsjs/go/main/App";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { models } from "wailsjs/go/models";

type ListItemProps = {
  list: models.List;
  onDelete: (id: number) => void;
};

export const ListItem = ({ list, onDelete }: ListItemProps) => {
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
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

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis
              className={`w-4 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(list.ID)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarMenuButton>
  );
};
