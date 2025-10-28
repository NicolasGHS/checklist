import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../src/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar/AppSidebar";
import { ThemeProvider } from "./components/theme-provider";
import { CountContextProvider } from "./contexts/CountContext";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  UpdateTodoList,
  UpdateListArea,
  UpdateTodo,
} from "../wailsjs/go/main/App";
import { Hash } from "lucide-react";
import { models } from "wailsjs/go/models";
import { Notebar } from "./components/Notebar";

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
      setDraggedTask({ id: taskId, name: "Task" });
      console.log("Dragging task:", taskId);
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
      return;
    }

    // Check if we're dropping a task over a list
    if (
      active.id.toString().startsWith("task-") &&
      over.id.toString().startsWith("drop-list-")
    ) {
      const taskId = parseInt(active.id.toString().replace("task-", ""));
      const targetListId = parseInt(
        over.id.toString().replace("drop-list-", "")
      );

      console.log(`Attempting to move task ${taskId} to list ${targetListId}`);

      // Special handling for Today item (ID 5)
      if (targetListId === 5) {
        console.log(`Setting deadline to today for task ${taskId}`);

        try {
          // Get the task data to preserve other properties
          const taskData = active.data.current?.todo;
          if (taskData) {
            // Set deadline to today at end of day (23:59:59)
            const today = new Date();
            const todayDeadline = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              23,
              59,
              59,
              999
            );

            await UpdateTodo(
              taskId,
              taskData.Name,
              taskData.Description || "",
              taskData.ListID,
              false, // today flag
              todayDeadline.toISOString()
            );

            console.log(
              `Successfully set deadline to today for task ${taskId}`
            );

            window.dispatchEvent(
              new CustomEvent("taskMoved", {
                detail: { taskId, targetListId, deadlineSet: true },
              })
            );
          }
        } catch (error) {
          console.error("Failed to set deadline for task:", error);
        }
      } else {
        // Regular list move
        try {
          await UpdateTodoList(taskId, targetListId);
          console.log(
            `Successfully moved task ${taskId} to list ${targetListId}`
          );

          window.dispatchEvent(
            new CustomEvent("taskMoved", {
              detail: { taskId, targetListId },
            })
          );
        } catch (error) {
          console.error("Failed to move task to list:", error);
        }
      }
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
    } else {
      console.log(
        "Drop target not recognized or incompatible drag/drop combination"
      );
    }
  };

  return (
    <CountContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                  Drag to Today to set deadline...
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
