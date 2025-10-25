import { Calendar, FolderOpen, Inbox, Layers, Star, Book } from "lucide-react";

export const sidebarItems = [
  {
    id: 1,
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
    listId: 1,
  },
  {
    id: 5,
    title: "Today",
    url: "/today",
    icon: Star,
    listId: 0,
  },
  {
    id: 2,
    title: "Upcoming",
    url: "/upcoming",
    icon: Calendar,
    listId: 0,
  },
  {
    id: 3,
    title: "Anytime",
    url: "/anytime",
    icon: FolderOpen,
    listId: 0,
  },
  {
    id: 4,
    title: "Someday",
    url: "/someday",
    icon: Layers,
    listId: 0,
  },
  {
    id: 5,
    title: "Logbook",
    url: "/logbook",
    icon: Book,
    listId: 0,
  },
];
