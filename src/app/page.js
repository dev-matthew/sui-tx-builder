"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";

import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function Main() {
  return (
    <>
      <SidebarProvider
          style={{
            "--sidebar-width": "26rem" // Adjust sidebar width
          }}
        >
        <AppSidebar />
        <div className="w-full h-screen">
          <ReactFlow>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
