"use client";

import { useState } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { blocks } from "@/components/blocks";

import { ReactFlow, ReactFlowProvider, Background, Controls, Panel, ViewportPortal, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from "@/components/custom-node";

const nodeTypes = {
  custom: CustomNode,
};

const groupNodeSetyle = {
  zIndex: -1
}

export default function Main() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const addNode = (block, x = undefined, y = undefined, addPrevEdge = false, group = undefined, parentOffset = undefined) => {
    setNodes((prevNodes) => {
      const newNodeId = `${block.id}-${prevNodes.length}`;
  
      const newNode = {
        id: newNodeId,
        position: {
          x: x !== undefined ? x : Math.random() * 400,
          y: y !== undefined ? y : Math.random() * 400,
        },
        data: { label: block.title },
        type: group == undefined ? "custom" : "group",
        style: group == undefined ? {} : { ...groupNodeSetyle, width: group.width, height: group.height },
        parentId: parentOffset == undefined ? undefined : prevNodes[prevNodes.length - 1 - parentOffset].id,
        selectable: true
      };

      if (parentOffset != undefined) {
        newNode.extent = "parent"
      }
  
      if (addPrevEdge && prevNodes.length > 0) {
        const prevNodeId = prevNodes[prevNodes.length - 1].id;
        onConnect({
          source: prevNodeId,
          target: newNodeId,
        });
      }
  
      return [...prevNodes, newNode];
    });
  };

  const onConnect = (params) => {
    const edgeId = `${params.source}-${params.target}`;
    setEdges((prevEdges) => {
      const edgeExists = prevEdges.some((edge) => edge.id === edgeId);
      if (edgeExists) {
        return prevEdges;
      }

      return [
        ...prevEdges,
        {
          ...params,
          id: edgeId,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
          },
          style: {
            strokeWidth: 2,
          },
          selectable: true,
          focusable: true,
        },
      ];
    });
  };
  

  const search = (data) => {
    let functions = data.result.transaction.data.transaction.transactions;
    let x = Math.random() * 400;
    let y = 40;
    let group_block = {
      id: "TransactionBlock",
      title: "Transaction Block"
    }
    let group_info = {
      height: 80 + 64 * functions.length,
      width: 200
    }
    addNode(group_block, x, y, false, group_info, undefined);
    functions.forEach(function(func, index) {
      let id = Object.keys(func)[0];
      let block = blocks.find(block => block.id === id);
      if (block) {
        addNode(block, 50, y, index > 0, undefined, index);
        y += 64;
      }
    });
  }

  return (
    <>
      <SidebarProvider
        style={{
          "--sidebar-width": "26rem"
        }}
      >
        <AppSidebar
          onAddNode={addNode}
          onSearch={search}
        />
        <div className="w-full h-screen">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodesConnectable={true}
              defaultViewport={{ zoom: 1.5, x: 0, y: 0 }}
              nodeTypes={nodeTypes}
              edgesFocusable={true}
            >
              <Background />
              <Controls position="bottom-right"/>
              <Panel position="top-left"><SidebarTrigger /></Panel>
              <Panel position="top-right">
                <Button type="submit" className="mr-2 bg-sui_dark hover:bg-sui_dark hover:brightness-110">Connect Wallet</Button>
                <Button type="submit" className="bg-sui hover:bg-sui hover:brightness-110">Deploy Transaction</Button>
              </Panel>
              {nodes.length == 0 && <ViewportPortal>
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/4 -translate-y-1/4 text-center whitespace-normal p-4 max-w-sm break-words text-muted-foreground">
                  Get started by searching for on-chain transactions or selecting components from the left sidebar
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
