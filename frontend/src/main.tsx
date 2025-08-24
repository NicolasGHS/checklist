import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <SidebarProvider>
      <SidebarTrigger />
      <main className="flex h-screen w-screen">
        <AppSidebar />
        <App />
      </main>
    </SidebarProvider>
  </React.StrictMode>
);
