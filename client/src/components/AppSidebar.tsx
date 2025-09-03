import { Calendar, Inbox, Star, FolderOpen, Hash } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "./ui/separator";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";

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
import { GetLists, GetAreas, UpdateListArea } from "../../wailsjs/go/main/App";
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
  },
  {
    title: "Today",
    url: "/today",
    icon: Star,
  },
  {
    title: "Upcoming",
    url: "/upcoming",
    icon: Calendar,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [lists, setLists] = useState<List[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [showAreaCreation, setShowAreaCreation] = useState<boolean>(false);
  const [showListCreation, setShowListCreation] = useState<boolean>(false);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);
  const [activeList, setActiveList] = useState<List | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedList = lists.find((list) => list.ID === active.id);
    setActiveList(draggedList || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveList(null);

    if (!over) return;

    // Check if we're dropping over an area
    if (over.id.toString().startsWith("area-")) {
      const areaId = parseInt(over.id.toString().replace("area-", ""));
      const listId = parseInt(active.id.toString());

      try {
        await UpdateListArea(listId, areaId);
        // Reload data to reflect changes
        await loadLists();
        await loadAreas();
        setUpdateTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Failed to update list area:", error);
      }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <div>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          location.pathname === item.url ||
                          (location.pathname === "/" && item.url === "/inbox")
                        }
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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

      <DragOverlay>
        {activeList ? (
          <div className="flex items-center gap-2 bg-background border rounded px-2 py-1 shadow-lg">
            <Hash className="w-4 h-4" />
            {activeList.Name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
