import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { ThemeProvider } from "./components/theme-provider";
import { Separator } from "./components/ui/separator";
import { Toolbar } from "./components/Toolbar";

const Layout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <div className="p-4 border-b text-foreground">
              <SidebarTrigger />
            </div>
            <div className="flex-1">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;
