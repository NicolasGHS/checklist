import { Area } from "../types/areas";
import { GetListsByArea } from "../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import { SidebarMenuItem } from "./ui/sidebar";
import { ListItem } from "./ListItem";
import { List } from "../types/list";
import { Box } from "lucide-react";

type AreaListProps = {
  areaItem: Area;
};

export const AreaList = ({ areaItem }: AreaListProps) => {
  const [lists, setLists] = useState<List[]>([]);

  const loadLists = async () => {
    const result = await GetListsByArea(areaItem.ID);
    setLists(result);
  };

  useEffect(() => {
    loadLists();
  }, [areaItem]);

  return (
    <div className="mb-4">
      <div className="flex gap-2 ml-2 items-center">
        <Box className="w-4 h-4 mb-1" />
        <p className="font-semibold text-base">{areaItem.Name}</p>
      </div>
      <div className="mt-1">
        {lists.map((list) => (
          <SidebarMenuItem>
            <ListItem list={list} key={list.ID} />
          </SidebarMenuItem>
        ))}
      </div>
    </div>
  );
};
