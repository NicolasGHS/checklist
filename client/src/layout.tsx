import { useState } from "react";
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
import { Notebar } from "./components/Notebar/Notebar";

/* -----------------------------
  Helper Functions
--------------------------------*/
async function handleTaskDrop(
  active: DragEndEvent["active"],
  over: DragEndEvent["over"]
) {
  if (!over) return;

  const taskId = parseInt(active.id.toString().replace("task-", ""));
  const targetDropId = over.id.toString().replace("drop-list-", "");
  const taskData = active.data.current?.todo as models.Todo | undefined;

  if (!taskData) return;

  try {
    if (targetDropId === "sidebar-today") {
      // Move to Today — set deadline to end of current day
      const now = new Date();
      const todayDeadline = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
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
        false,
        todayDeadline.toISOString()
      );

      window.dispatchEvent(
        new CustomEvent("taskMoved", {
          detail: { taskId, targetListId: "today", deadlineSet: true },
        })
      );
    } else {
      // Move to another list - parse as numeric list ID
      const targetListId = parseInt(targetDropId);
      await UpdateTodoList(taskId, targetListId);
      window.dispatchEvent(
        new CustomEvent("taskMoved", {
          detail: { taskId, targetListId },
        })
      );
    }
  } catch (error) {
    console.error("Failed to handle task drop:", error);
  }
}

async function handleListDrop(
  active: DragEndEvent["active"],
  over: DragEndEvent["over"]
) {
  if (!over) return;

  const listId = parseInt(active.id.toString().replace("list-", ""));
  const areaId = parseInt(over.id.toString().replace("area-", ""));

  try {
    await UpdateListArea(listId, areaId);
    window.dispatchEvent(
      new CustomEvent("listMoved", { detail: { listId, areaId } })
    );
  } catch (error) {
    console.error("Failed to move list:", error);
  }
}

const Layout = () => {
  const [draggedTask, setDraggedTask] = useState<{
    id: number;
    name?: string;
  } | null>(null);
  const [draggedList, setDraggedList] = useState<models.List | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();

    if (id.startsWith("task-")) {
      const taskId = parseInt(id.replace("task-", ""));
      setDraggedTask({ id: taskId, name: "Task" });
    } else if (id.startsWith("list-")) {
      const listId = parseInt(id.replace("list-", ""));
      setDraggedList({ ID: listId } as models.List);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedTask(null);
    setDraggedList(null);

    if (!over) return;

    const isTaskDrop =
      active.id.toString().startsWith("task-") &&
      over.id.toString().startsWith("drop-list-");
    const isListDrop =
      active.id.toString().startsWith("list-") &&
      over.id.toString().startsWith("area-");

    if (isTaskDrop) return handleTaskDrop(active, over);
    if (isListDrop) return handleListDrop(active, over);
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
