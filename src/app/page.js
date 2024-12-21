"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function Main() {
  return (
    <>
      <SidebarProvider
          style={{
            "--sidebar-width": "24rem"
          }}
        >
        <AppSidebar />
        <SidebarTrigger className="ml-4 mt-4"/>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
