import { ListFilter, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type ProjectFilterOption = {
  id: number;
  name: string;
  count: number;
};

type ProjectFilterProps = {
  options: ProjectFilterOption[];
  selected: number[];
  onChange: (selected: number[]) => void;
};

export const ProjectFilter = ({
  options,
  selected,
  onChange,
}: ProjectFilterProps) => {
  const toggle = (id: number) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  const label =
    selected.length === 0
      ? "All projects"
      : selected.length === 1
        ? (options.find((o) => o.id === selected[0])?.name ?? "1 project")
        : `${selected.length} projects`;

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`hover:cursor-pointer ${
              selected.length > 0 ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span className="max-w-[160px] truncate">{label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 text-left">
          <DropdownMenuLabel>Filter by project</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              No projects to filter
            </p>
          ) : (
            options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={selected.includes(option.id)}
                // keep the menu open so several projects can be picked
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => toggle(option.id)}
              >
                <span className="flex-1 truncate">{option.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {option.count}
                </span>
              </DropdownMenuCheckboxItem>
            ))
          )}
          {selected.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onChange([])}>
                Show all projects
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {selected.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:cursor-pointer"
          onClick={() => onChange([])}
          title="Clear filter"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
