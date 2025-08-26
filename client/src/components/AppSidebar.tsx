import { Calendar, Inbox, Star, FolderOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
import { Lists } from "./Lists";
import { GetLists } from "../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import { List } from "../types/list";

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

  const loadLists = async () => {
    const result = (await GetLists()) as unknown as List[];
    setLists(result);
  };

  useEffect(() => {
    loadLists();
  }, []);

  console.log("lists: ", lists);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
              <Lists items={lists} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between mr-1 ml-1">
          <NewListButton />
          <SettingsButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
