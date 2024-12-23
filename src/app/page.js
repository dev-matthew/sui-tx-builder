"use client";

import { useState } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { blocks } from "@/components/blocks";
import { useToast } from "@/components/hooks/use-toast";

import { ReactFlow, ReactFlowProvider, Background, Controls, Panel, ViewportPortal, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function Main() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { toast } = useToast()

  const nodeTypes = blocks.reduce((acc, block) => {
    acc[block.id] = block.node;
    return acc;
  }, {});

  const addNode = (
    block,
    x = undefined,
    y = undefined,
    addPrevEdge = false,
    group = undefined,
    parentOffset = undefined,
    customData = {}
  ) => {
    setNodes((prevNodes) => {
      const newNodeId = `${block.id}-${prevNodes.length}`;
  
      const newNode = {
        id: newNodeId,
        position: {
          x: x !== undefined ? x : Math.random() * 400,
          y: y !== undefined ? y : Math.random() * 400,
        },
        data: {
          label: block.title,
          icon: block.icon,
          ...customData,
        },
        type: group == undefined ? block.id : "group",
        style: group == undefined ? {} : { zIndex: -1, width: group.width, height: group.height },
        parentId: parentOffset == undefined ? undefined : prevNodes[prevNodes.length - 1 - parentOffset].id,
        selectable: true,
      };
  
      if (parentOffset != undefined) {
        newNode.extent = "parent";
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
    if (params.source == params.target) {
      toast({
        title: `Couldn't add edge`,
        description: `Self loops are not allowed`
      })
      return;
    }

    let horizontal = false;
    // One of them has to be left and one has to be right if it's a data edge
    if (params.sourceHandle.includes("right") || params.sourceHandle.includes("left") || params.targetHandle.includes("right") || params.targetHandle.includes("left")) {
      // One of our nodes is horizontal, so we have to make sure the other is as well
      if (!((params.sourceHandle.includes("right") && params.targetHandle.includes("left")) || (params.sourceHandle.includes("left") && params.targetHandle.includes("right")))) {
        toast({
          title: `Couldn't add edge`,
          description: `Data handles can only be connected horizontally`
        })
        return;
      }
      horizontal = true;
    }

    const edgeId = `${params.source}/${params.sourceHandle}---${params.target}/${params.targetHandle}`;
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
            color: "bg-sui"
          },
          style: {
            strokeWidth: 4
          },
          selectable: true,
          focusable: true,
          animated: horizontal
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
        let customData = {};
        switch (id) {
          case "TransferObjects":
            customData = {
              to: func[id][1]["Input"],
              objects: func[id][0].map(item => item.Result)
            }
            break;
          case "MoveCall":
            customData = {
              package: func[id]["package"],
              module: func[id]["module"],
              function: func[id]["function"],
              arguments: func[id]["arguments"].map(item => ({
                "type": undefined,
                "value": item["Input"]
              }))
            }
            break;
        }
        addNode(block, 50, y, index > 0, undefined, index, customData);
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
          toast={toast}
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
              defaultViewport={{ zoom: 1, x: 0, y: 0 }}
              nodeTypes={nodeTypes}
              edgesFocusable={true}
            >
              <Background />
              <Controls position="bottom-left"/>
              <Panel position="top-left"><SidebarTrigger /></Panel>
              <Panel position="top-right">
                <Button type="submit" className="mr-2 bg-sui_dark hover:bg-sui_dark hover:brightness-110">Connect Wallet</Button>
                <Button type="submit" className="bg-sui hover:bg-sui hover:brightness-110">Execute Transaction</Button>
              </Panel>
              {nodes.length == 0 && <ViewportPortal>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center whitespace-normal p-4 max-w-sm break-words text-muted-foreground text-xl">
                  Get started by searching for on-chain transactions or selecting components from the left sidebar
                </div>
              </ViewportPortal>}
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </SidebarProvider>
    </>
  );
}
