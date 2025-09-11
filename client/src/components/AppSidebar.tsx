import { Calendar, Inbox, Star, FolderOpen, Layers } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useDroppable } from "@dnd-kit/core";
import { models } from "wailsjs/go/models";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { SettingsButton } from "./SettingsButton";
import { NewListButton } from "./NewListButton";
import {
  GetLists,
  GetAreas,
  GetTodayCount,
  GetListCount,
  GetListsWithoutArea,
  DeleteList,
} from "../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import { AreaList } from "./AreaList";
import { ScrollArea } from "./ui/scroll-area";
import { ListItem } from "./ListItem";

const items = [
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
    listId: 1,
  },
  {
    title: "Today",
    url: "/today",
    icon: Star,
    listId: 0,
  },
  {
    title: "Upcoming",
    url: "/upcoming",
    icon: Calendar,
    listId: 0,
  },
  {
    title: "Anytime",
    url: "/anytime",
    icon: FolderOpen,
    listId: 0,
  },
  {
    title: "Someday",
    url: "/someday",
    icon: Layers,
    listId: 0,
  },
];

// Component for droppable menu items
const DroppableMenuItem = ({ item }: { item: (typeof items)[0] }) => {
  const location = useLocation();
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-list-${item.listId}`,
  });
  const [count, setCount] = useState<number>(0);
  const isToday = item.title == "Today";

  const getCount = async () => {
    if (isToday) {
      const count = await GetTodayCount();
      setCount(count);
    } else {
      const count = await GetListCount(item.listId);
      setCount(count);
    }
  };

  useEffect(() => {
    getCount();
  }, [item]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={
          location.pathname === item.url ||
          (location.pathname === "/" && item.url === "/inbox")
        }
      >
        <div
          ref={setNodeRef}
          className={`transition-all duration-200 rounded-md ${
            isOver && item.listId > 0
              ? "bg-accent/50 border-2 border-dashed border-primary/50 p-1 scale-105"
              : "hover:bg-accent/20"
          }`}
        >
          <Link
            to={item.url}
            className="flex items-center justify-between gap-2 w-full p-2"
          >
            <div className="flex items-center gap-2">
              <item.icon className="w-5" />
              <span>{item.title}</span>
            </div>
            {["Today", "Inbox"].includes(item.title) && <p>{count}</p>}
          </Link>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const location = useLocation();
  const [lists, setLists] = useState<models.List[]>([]);
  const [listsWithoutArea, setListsWithoutArea] = useState<models.List[]>([]);
  const [areas, setAreas] = useState<models.Area[]>([]);
  const [showAreaCreation, setShowAreaCreation] = useState<boolean>(false);
  const [showListCreation, setShowListCreation] = useState<boolean>(false);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  const loadLists = async () => {
    let result = (await GetLists()) as unknown as models.List[];
    setLists(result);

    result = (await GetListsWithoutArea()) as unknown as models.List[];
    setListsWithoutArea(result);
  };

  const loadAreas = async () => {
    const result = (await GetAreas()) as unknown as models.Area[];
    setAreas(result);
  };

  const handleDelete = async (id: number) => {
    try {
      await DeleteList(id);
    } catch (error) {
      console.error("Error deleting list: ", error);
    }

    loadLists();
  };

  useEffect(() => {
    loadLists();
    loadAreas();
  }, []);

  // Listen for list move events
  useEffect(() => {
    const handleListMoved = () => {
      loadLists();
      loadAreas();
      setUpdateTrigger((prev) => prev + 1);
    };

    const handleTaskMoved = () => {
      loadLists();
    };

    window.addEventListener("listMoved", handleListMoved);
    window.addEventListener("taskMoved", handleTaskMoved);

    return () => {
      window.removeEventListener("listMoved", handleListMoved);
      window.removeEventListener("taskMoved", handleTaskMoved);
    };
  }, []);

  const areaCreation = () => {
    setShowAreaCreation(true);
  };

  const listCreation = () => {
    setShowListCreation(true);
  };

  const closeAreaCreation = () => {
    setShowAreaCreation(false);
  };

  const closeListCreation = () => {
    setShowListCreation(false);
  };

  return (
    <Sidebar>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupContent className="mt-5">
              <SidebarMenu>
                <div>
                  {items.map((item) => (
                    <DroppableMenuItem key={item.title} item={item} />
                  ))}
                </div>

                <div className="mt-3 ml-2">
                  {listsWithoutArea.map((list) => (
                    <ListItem
                      key={list.ID}
                      list={list}
                      onDelete={() => handleDelete(list.ID)}
                    />
                  ))}
                </div>
                <div className="mt-3">
                  {areas.map((area) => (
                    <AreaList
                      key={`${area.ID}-${updateTrigger}`}
                      areaItem={area}
                      deleteList={() => handleDelete}
                    />
                  ))}
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <div className="flex mt-1 items-center justify-between mr-1 ml-1">
          <NewListButton
            addArea={areaCreation}
            addList={listCreation}
            showAreaCreation={showAreaCreation}
            showListCreation={showListCreation}
            closeAreaCreation={closeAreaCreation}
            closeListCreation={closeListCreation}
            reloadData={() => {
              loadLists();
              loadAreas();
            }}
          />
          <SettingsButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
