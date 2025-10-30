import { Calendar, FolderOpen, Inbox, Layers, Star, Book } from "lucide-react";

export const sidebarItems = [
  {
    id: "sidebar-inbox",
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
    listId: 1,
  },
  {
    id: "sidebar-today",
    title: "Today",
    url: "/today",
    icon: Star,
    listId: 0,
  },
  {
    id: "sidebar-upcoming",
    title: "Upcoming",
    url: "/upcoming",
    icon: Calendar,
    listId: 0,
  },
  {
    id: "sidebar-anytime",
    title: "Anytime",
    url: "/anytime",
    icon: FolderOpen,
    listId: 0,
  },
  {
    id: "sidebar-someday",
    title: "Someday",
    url: "/someday",
    icon: Layers,
    listId: 0,
  },
  {
    id: "sidebar-logbook",
    title: "Logbook",
    url: "/logbook",
    icon: Book,
    listId: 0,
  },
];
