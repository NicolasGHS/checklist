import { GetListsByArea } from "../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import { SidebarMenuItem } from "./ui/sidebar";
import { ListItem } from "./ListItem";
import { Box } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { models } from "wailsjs/go/models";

type AreaListProps = {
  areaItem: models.Area;
  deleteList: (id: number) => void;
};

export const AreaList = ({ areaItem, deleteList }: AreaListProps) => {
  const [lists, setLists] = useState<models.List[]>([]);
  const { isOver, setNodeRef } = useDroppable({
    id: `area-${areaItem.ID}`,
  });

  const loadLists = async () => {
    const result = await GetListsByArea(areaItem.ID);
    setLists(result);
  };

  useEffect(() => {
    loadLists();
  }, [areaItem.ID]);

  return (
    <div className="mb-4 ml-2">
      <div
        ref={setNodeRef}
        className={`transition-colors duration-200 rounded-md p-2 ${
          isOver
            ? "bg-accent/50 border-2 border-dashed border-accent-foreground/20"
            : ""
        }`}
      >
        <div className="flex gap-2 items-center">
          <Box className="w-4 h-4 mb-1" />
          <p className="font-semibold text-base">{areaItem.Name}</p>
        </div>
      </div>

      <div className="mt-1 ml-2">
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
