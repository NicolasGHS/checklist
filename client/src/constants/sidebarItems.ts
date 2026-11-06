import { Calendar, FolderOpen, Inbox, Layers, Star, Book } from "lucide-react";

// What dropping a task on a sidebar view does is decided in layout.tsx by
// `view`. Only Inbox is a real list; the other views are filters, so their
// drop targets must never be mistaken for list IDs.
export type SidebarView =
  | "inbox"
  | "today"
  | "upcoming"
  | "anytime"
  | "someday"
  | "logbook";

export const VIEW_DROP_PREFIX = "drop-view-";

export const sidebarItems: {
  view: SidebarView;
  title: string;
  url: string;
  icon: typeof Inbox;
}[] = [
  { view: "inbox", title: "Inbox", url: "/inbox", icon: Inbox },
  { view: "today", title: "Today", url: "/today", icon: Star },
  { view: "upcoming", title: "Upcoming", url: "/upcoming", icon: Calendar },
  { view: "anytime", title: "Anytime", url: "/anytime", icon: FolderOpen },
  { view: "someday", title: "Someday", url: "/someday", icon: Layers },
  { view: "logbook", title: "Logbook", url: "/logbook", icon: Book },
];
