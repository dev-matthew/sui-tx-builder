"use client";

import { useState } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import { ReactFlow, ReactFlowProvider, Background, Controls, Panel, ViewportPortal, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [

];
 
const initialEdges = [

];

export default function Main() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const addNode = (block) => {
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: `${block.title}-${prevNodes.length}`,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: block.title },
        type: "default",
      },
    ]);
  };

  return (
    <>
      <SidebarProvider
          style={{
            "--sidebar-width": "26rem"
          }}
        >
        <AppSidebar onAddNode={addNode}/>
        <div className="w-full h-screen">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
            >
              <Background />
              <Controls position="bottom-right"/>
              <Panel position="top-left"><SidebarTrigger></SidebarTrigger></Panel>
              <Panel position="top-right">
                <Button type="submit" className="mr-2">Connect Wallet</Button>
                <Button type="submit">Deploy Transaction</Button>
              </Panel>
              {nodes.length == 0 && <ViewportPortal>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center whitespace-normal p-4 max-w-sm break-words text-muted-foreground">
                  Get started by searching for on-chain transactions or dragging and dropping components here from the sidebar
                </div>
              </ViewportPortal>}
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
