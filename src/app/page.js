"use client";

import { useState } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { blocks } from "@/components/blocks";
import { useToast } from "@/components/hooks/use-toast";

import { ReactFlow, Background, Controls, Panel, ViewportPortal, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function Main() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { toast } = useToast();

  const nodeTypes = blocks.reduce((acc, block) => {
    acc[block.id] = block.node;
    return acc;
  }, {});

  const addNode = (
    block,
    x = undefined,
    y = undefined,
    addPrevEdge = false,
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
        type: block.id,
        selectable: true,
      };
  
      if (addPrevEdge && prevNodes.length > 0) {
        const prevNodeId = prevNodes[prevNodes.length - 1].id;
        onConnect({
          source: prevNodeId,
          target: newNodeId,
          sourceHandle: "bottom",
          targetHandle: "top"
        });
      }

      if (customData.backwardEdges) {
        customData.backwardEdges.forEach(function(edge, index) {
          // edge is an array with 2 values (index of node, index of output)
          const prevNodeId = prevNodes[edge[0]].id;
          onConnect({
            source: prevNodeId,
            target: newNodeId,
            sourceHandle: edge[1],
            targetHandle: edge[2]
          })
        })
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
          description: `Data handles can only be connected horizontally, and sequence handles can only be connected vertically`
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
          animated: horizontal,
          type: horizontal ? "default" : "smoothstep"
        },
      ];
    });
  };

  const getInput = (inputs, input) => {
    if ("Input" in input) {
      let index = input["Input"]
      let input_obj = inputs[index];
      let returnValue = "Unknown";
      if (input_obj.type == "object") {
        returnValue = input_obj.objectId;
      } else if (input_obj.type == "pure") {
        returnValue = input_obj.value;
      }
      return returnValue;
    } else {
      // then this value comes from nested result or result so we will leave it blank for now
      return undefined;
    }
  }

  const extractArgsCounts = (args, countArr) => {
    args.forEach(function(arg, index) {
      if ("NestedResult" in arg) {
        countArr[arg["NestedResult"][0]] = Math.max(countArr[arg["NestedResult"][0]], arg["NestedResult"][1] + 1)
      } else if ("Result" in arg) {
        countArr[arg["Result"]] = Math.max(countArr[arg["Result"]], 1)
      }
    })
  }

  const getBackwardEdges = (args, singleArg = undefined, argTagSuffix = "") => {
    let backwardEdgesList = [];
    args.forEach(function(arg, index_arg) {
      if ("NestedResult" in arg) {
        backwardEdgesList.push([arg["NestedResult"][0], `right-${arg["NestedResult"][1]}`, `left-${index_arg}`])
      } else if ("Result" in arg) {
        // prev node id, source handle, target handle
        backwardEdgesList.push([arg["Result"], `right-0`, `left-${index_arg}`])
      }
    });
    if (singleArg != undefined) {
      if ("NestedResult" in singleArg) {
        backwardEdgesList.push([singleArg["NestedResult"][0], `right-${singleArg["NestedResult"][1]}`, `left-${argTagSuffix}`])
      } else if ("Result" in singleArg) {
        backwardEdgesList.push([singleArg["Result"], `right-0`, `left-${argTagSuffix}`])
      }
    }
    return backwardEdgesList;
  }

  const search = (data) => {
    /*  The first thing we do is go through every transaction and see what args it is using.
        If it is using outputs from previous transactions as args for this one, we update the
        output count for the previous transaction so that we can create an edge later on.
    */
    let functions = data.result.transaction.data.transaction.transactions;
    let inputs = data.result.transaction.data.transaction.inputs;
    let outputCountsPerNode = new Array(functions.length).fill(0);
    functions.forEach(function(func, index) {
      let id = Object.keys(func)[0];
      let block = blocks.find(block => block.id === id);
      if (block) {
        switch(id) {
          case "MoveCall":
            extractArgsCounts(func[id]["arguments"], outputCountsPerNode);
            break;
          case "TransferObjects":
            extractArgsCounts(func[id][0], outputCountsPerNode);
            break;
          case "MergeCoins":
            break;
          case "SplitCoins":
            extractArgsCounts(func[id][1], outputCountsPerNode);
            break;
          default:
            break;
        }
      }
    })

    console.log(data);

    let x = 50;
    let y = 50;
    functions.forEach(function(func, index) {
      let id = Object.keys(func)[0];
      let block = blocks.find(block => block.id === id);
      if (block) {
        let customData = {};
        switch (id) {
          case "TransferObjects":
            customData = {
              to: getInput(inputs, func[id][1]),
              objects: func[id][0].map(item => getInput(inputs, item)),
              backwardEdges: getBackwardEdges(func[id][0], func[id][1], "to")
            }
            break;
          case "MoveCall":
            customData = {
              package: func[id]["package"],
              module: func[id]["module"],
              function: func[id]["function"],
              arguments: func[id]["arguments"].map(item => ({"value": getInput(inputs, item)})),
              outputs: new Array(outputCountsPerNode[index]).fill({value: ""}),
              backwardEdges: getBackwardEdges(func[id]["arguments"]),
              packageData: data.addedMetadata?.[func[id]["package"]]
            }
            break;
          case "SplitCoins":
            let isGas = typeof func[id][0] == "string";
            let backwardEdgesList;
            if (isGas) {
              backwardEdgesList = getBackwardEdges(func[id][1]);
            } else {
              backwardEdgesList = getBackwardEdges(func[id][1], func[id][0], "coin");
            }
            customData = {
              coin: isGas ? func[id][0] : getInput(inputs, func[id][0]),
              amounts: func[id][1].map(item => getInput(inputs, item)),
              backwardEdges: backwardEdgesList
            }
            break;
          case "MergeCoins":
            customData = {}
            break;
        }
        addNode(block, x, y, index > 0, customData);
        x += 350;
      }
    });
  }

  return (
    <>
      <SidebarProvider
        style={{
          "--sidebar-width": "24rem"
        }}
      >
        <AppSidebar
          onAddNode={addNode}
          onSearch={search}
          toast={toast}
        />
        <div className="w-full h-screen">
          
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
        </div>
      </SidebarProvider>
    </>
  );
}
