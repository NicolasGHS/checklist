import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-gray-800">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <SidebarTrigger />
          </div>
          <div className="flex-1 bg-gray-800">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
