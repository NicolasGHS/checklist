import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../src/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar/AppSidebar";
import { ThemeProvider } from "./components/theme-provider";
import { CountContextProvider } from "./contexts/CountContext";
import {
  closestCenter,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core";
import {
  UpdateTodoList,
  UpdateListArea,
  ScheduleTodo,
  UnscheduleTodo,
  SetTodoCompleted,
} from "bindings/checklist/app";
import { SidebarView, VIEW_DROP_PREFIX } from "@/constants/sidebarItems";
import { endOfDayISO } from "@/utils/dates";
import { Hash } from "lucide-react";
import * as models from "bindings/checklist/core/models";
import { Notebar } from "./components/Notebar/Notebar";

const isTaskId = (id: unknown) => String(id).startsWith("task-");

// What dropping a task on a sidebar view means. Inbox is a real list and
// goes through the regular list move instead.
const dropOnView = async (taskId: number, view: SidebarView) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  switch (view) {
    case "today":
      return ScheduleTodo(taskId, endOfDayISO(new Date()));
    case "upcoming":
      return ScheduleTodo(taskId, endOfDayISO(tomorrow));
    case "anytime":
      return UnscheduleTodo(taskId, false);
    case "someday":
      return UnscheduleTodo(taskId, true);
    case "logbook":
      return SetTodoCompleted(taskId, true);
    case "inbox":
      return UpdateTodoList(taskId, 1);
  }
};

// Sidebar targets (lists, Today, areas) win when the pointer is on them;
// otherwise the closest task is the target, which drives reordering.
const collisionDetection: CollisionDetection = (args) => {
  const sidebarHits = pointerWithin(args).filter((c) => !isTaskId(c.id));
  if (sidebarHits.length > 0) return sidebarHits;
  return closestCenter({
    ...args,
    droppableContainers: args.droppableContainers.filter((c) =>
      isTaskId(c.id),
    ),
  });
};

const Layout: React.FC = () => {
  const [draggedTask, setDraggedTask] = useState<{
    id: number;
    name?: string;
  } | null>(null);
  const [draggedList, setDraggedList] = useState<models.List | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log("Drag started:", active.id);

    if (active.id.toString().startsWith("task-")) {
      const taskId = parseInt(active.id.toString().replace("task-", ""));
      setDraggedTask({ id: taskId, name: active.data.current?.todo?.Name });
      console.log("Dragging task:", taskId);
      window.dispatchEvent(new CustomEvent("taskDragStarted", { detail: { taskId } }));
    } else if (active.id.toString().startsWith("list-")) {
      setDraggedList({
        ID: parseInt(active.id.toString().replace("list-", "")),
      } as models.List);
      console.log("Dragging list:", active.id);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("Drag ended:", { active: active.id, over: over?.id });
    setDraggedTask(null);
    setDraggedList(null);

    if (!over) {
      console.log("No drop target");
      if (active.id.toString().startsWith("task-")) {
        const taskId = parseInt(active.id.toString().replace("task-", ""));
        window.dispatchEvent(new CustomEvent("taskDragCancelled", { detail: { taskId } }));
      }
      return;
    }

    const activeKey = active.id.toString();
    const overKey = over.id.toString();

    if (activeKey.startsWith("task-") && overKey.startsWith(VIEW_DROP_PREFIX)) {
      const taskId = parseInt(activeKey.replace("task-", ""));
      const view = overKey.replace(VIEW_DROP_PREFIX, "") as SidebarView;

      try {
        await dropOnView(taskId, view);
      } catch (error) {
        console.error(`Failed to move task ${taskId} to ${view}:`, error);
      }
      window.dispatchEvent(
        new CustomEvent("taskMoved", { detail: { taskId, view } })
      );
    } else if (
      activeKey.startsWith("task-") &&
      overKey.startsWith("drop-list-")
    ) {
      const taskId = parseInt(activeKey.replace("task-", ""));
      const targetListId = parseInt(overKey.replace("drop-list-", ""));

      try {
        await UpdateTodoList(taskId, targetListId);
      } catch (error) {
        console.error("Failed to move task to list:", error);
      }
      window.dispatchEvent(
        new CustomEvent("taskMoved", { detail: { taskId, targetListId } })
      );
    } else if (
      active.id.toString().startsWith("list-") &&
      over.id.toString().startsWith("area-")
    ) {
      const listId = parseInt(active.id.toString().replace("list-", ""));
      const areaId = parseInt(over.id.toString().replace("area-", ""));

      console.log(`Attempting to move list ${listId} to area ${areaId}`);

      try {
        await UpdateListArea(listId, areaId);
        console.log(`Successfully moved list ${listId} to area ${areaId}`);

        // Dispatch a custom event to notify components to refresh their data
        window.dispatchEvent(
          new CustomEvent("listMoved", {
            detail: { listId, areaId },
          })
        );
      } catch (error) {
        console.error("Failed to move list to area:", error);
      }
    } else if (activeKey.startsWith("task-") && !overKey.startsWith("task-")) {
      // dropped somewhere that doesn't take tasks (e.g. an area): views that
      // hid the task when the drag started need to show it again
      const taskId = parseInt(activeKey.replace("task-", ""));
      window.dispatchEvent(
        new CustomEvent("taskDragCancelled", { detail: { taskId } })
      );
    }
  };

  return (
    <CountContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <DndContext
          collisionDetection={collisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SidebarProvider>
            <div className="flex min-h-screen w-screen bg-background">
              <AppSidebar />

              <div className="flex items-start p-4">
                <SidebarTrigger />
              </div>
              <main className="flex-1 flex flex-col bg-background">
                <div className="flex-1 bg-background">
                  <Outlet />
                </div>
              </main>

              <div className="flex items-start p-4">
                <Notebar />
              </div>
            </div>
          </SidebarProvider>
          <DragOverlay>
            {draggedTask ? (
              <div className="flex gap-3 items-center bg-background border rounded px-3 py-2 shadow-lg opacity-90">
                <div className="w-4 h-4 border border-border rounded bg-muted"></div>
                <p className="text-foreground">
                  {draggedTask.name ?? "Task"}
                </p>
              </div>
            ) : draggedList ? (
              <div className="flex items-center gap-2 bg-background border rounded px-2 py-1 shadow-lg">
                <Hash className="w-4 h-4" />
                <span>Moving list...</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </ThemeProvider>
    </CountContextProvider>
  );
};

export default Layout;
