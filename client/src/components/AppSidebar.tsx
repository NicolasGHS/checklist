import { Calendar, Inbox, Star, FolderOpen, Hash } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useDroppable } from "@dnd-kit/core";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { SettingsButton } from "./SettingsButton";
import { NewListButton } from "./NewListButton";
import { ListItem } from "./ListItem";
import { GetLists, GetAreas } from "../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import { List } from "../types/list";
import { Area } from "../types/areas";
import { AreaList } from "./AreaList";

// Menu items.
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
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
    listId: 0,
  },
];

// Component for droppable menu items
const DroppableMenuItem = ({ item }: { item: (typeof items)[0] }) => {
  const location = useLocation();
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-list-${item.listId}`,
  });

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
          <Link to={item.url} className="flex items-center gap-2 w-full p-2">
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const location = useLocation();
  const [lists, setLists] = useState<List[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [showAreaCreation, setShowAreaCreation] = useState<boolean>(false);
  const [showListCreation, setShowListCreation] = useState<boolean>(false);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  const loadLists = async () => {
    const result = (await GetLists()) as unknown as List[];
    setLists(result);
  };

  const loadAreas = async () => {
    const result = (await GetAreas()) as unknown as Area[];
    setAreas(result);
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <div>
                {items.map((item) => (
                  <DroppableMenuItem key={item.title} item={item} />
                ))}
              </div>

              <div className="mt-3">
                {areas.map((area) => (
                  <AreaList
                    key={`${area.ID}-${updateTrigger}`}
                    areaItem={area}
                  />
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <div className="flex items-center justify-between mr-1 ml-1">
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
