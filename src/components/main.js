import { useEffect } from 'react';

import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { Transaction } from "@mysten/sui/transactions";
import '@suiet/wallet-kit/style.css';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { blocks } from "@/components/blocks";
import EmptyNode from "@/components/nodes/EmptyNode";
import { useToast } from "@/components/hooks/use-toast";
import { Ellipsis } from "lucide-react";

import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  ViewportPortal,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
  getOutgoers
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function Main() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { getNodes, getEdges } = useReactFlow();
  const { toast } = useToast();
  const wallet = useWallet();

  const nodeTypes = blocks.reduce((acc, block) => {
    acc[block.id] = block.node;
    return acc;
  }, {
    "empty": EmptyNode
  });

  useEffect(() => {
    if (wallet.connected) {
      console.log('Wallet is connected:', wallet);
    } else {
      console.log('Wallet is not connected:', wallet);
    }
  }, [wallet.connected]);

  const removeHandle = (id, handle) => {
    setEdges((prev) =>
      prev.filter(
        (edge) =>
          !(edge.source === id && edge.sourceHandle === handle) &&
          !(edge.target === id && edge.targetHandle === handle)
      )
    );
  };

  const addNode = (
    block,
    x = undefined,
    y = undefined,
    addPrevEdge = false,
    customData = {},
    start = 0
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
          removeHandleCallback: removeHandle
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
          const prevNodeId = prevNodes[edge[0] + start].id;
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

  const hasCycleWrapper = (sourceIn, targetIn) => {
    const nodes = getNodes();
    const edges = getEdges();
    const target = nodes.find((node) => node.id === targetIn);
    const hasCycle = (node, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === sourceIn) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };
    if (!target || target.id === sourceIn) return false;
    return hasCycle(target);
  }

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

    // We don't want any cycles
    if (hasCycleWrapper(params.source, params.target)) {
      toast({
        title: `Couldn't add edge`,
        description: `Cycles are not allowed`
      })
      return;
    }

    // We don't want bottom handles going to 2 or more target handles and we don't want 2 or more bottom handles leading to the same target handle
    if (params.sourceHandle == "bottom") {  // target handle must then be top
      // The bottom source can't already have a target
      const targetExists = edges.some((edge) => edge.source == params.source && edge.sourceHandle == params.sourceHandle);

      // The top target can't already have a source
      const sourceExists = edges.some((edge) => edge.target == params.target && edge.targetHandle == params.targetHandle);

      if (targetExists || sourceExists) {
        toast({
          title: `Couldn't add edge`,
          description: `Nodes can only have one incoming and one outgoing sequence edge`
        })
        return;
      }
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

  const getTypeAndInput = (inputs, input) => {
    if ("Input" in input) {
      let index = input["Input"]
      let input_obj = inputs[index];
      let returnValue = [undefined, "Unknown"];
      if (input_obj.type == "object") {
        returnValue = ["object", input_obj.objectId];
      } else if (input_obj.type == "pure") {
        let valueType = input_obj.valueType;
        if (valueType.includes("vector")) {
          valueType = "vector";
        } else if (valueType.includes("option")) {
          valueType = "option";
        }
        returnValue = [valueType, input_obj.value];
      }
      return returnValue;
    } else {
      // then this value comes from nested result or result so we will leave it blank for now
      return ["result", undefined];
    }
  }

  const extractArgsCounts = (args, countArr) => {
    args.forEach(function(arg, index) {
      if (arg != undefined && typeof arg != "string") {
        if ("NestedResult" in arg) {
          countArr[arg["NestedResult"][0]] = Math.max(countArr[arg["NestedResult"][0]], arg["NestedResult"][1] + 1)
        } else if ("Result" in arg) {
          countArr[arg["Result"]] = Math.max(countArr[arg["Result"]], 1)
        }
      }
    })
  }

  const getBackwardEdges = (args, singleArg = undefined, argTagSuffix = "") => {
    let backwardEdgesList = [];
    args.forEach(function(arg, index_arg) {
      if (arg != undefined && typeof arg != "string") {
        if ("NestedResult" in arg) {
          backwardEdgesList.push([arg["NestedResult"][0], `right-${arg["NestedResult"][1]}`, `left-${index_arg}`])
        } else if ("Result" in arg) {
          // prev node id, source handle, target handle
          backwardEdgesList.push([arg["Result"], `right-0`, `left-${index_arg}`])
        }
      }
    });
    if (singleArg != undefined && typeof singleArg != "string") {
      if ("NestedResult" in singleArg) {
        backwardEdgesList.push([singleArg["NestedResult"][0], `right-${singleArg["NestedResult"][1]}`, `left-${argTagSuffix}`])
      } else if ("Result" in singleArg) {
        backwardEdgesList.push([singleArg["Result"], `right-0`, `left-${argTagSuffix}`])
      }
    }
    return backwardEdgesList;
  }

  const search = (data) => {
    console.log("Displaying searched data:", data);
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
            extractArgsCounts([...func[id][0], func[id][1]], outputCountsPerNode);
            break;
          case "MergeCoins":
            extractArgsCounts([...func[id][1], func[id][0]], outputCountsPerNode);
            break;
          case "SplitCoins":
            extractArgsCounts([...func[id][1], func[id][0]], outputCountsPerNode);
            break;
          case "MakeMoveVec":
            extractArgsCounts(func[id][1], outputCountsPerNode);
            break;
          default:
            break;
        }
      }
    })

    let x = Math.random() * 100;
    let y = Math.random() * 100;
    let start = nodes.length;

    functions.forEach(function(func, index) {
      let id = Object.keys(func)[0];
      let block = blocks.find(block => block.id === id);
      if (block) {
        let customData = {};
        switch (id) {
          case "TransferObjects":
            customData = {
              to: getTypeAndInput(inputs, func[id][1])[1],
              objects: func[id][0].map(item => getTypeAndInput(inputs, item))[1],
              backwardEdges: getBackwardEdges(func[id][0], func[id][1], "to")
            }
            break;
          case "MoveCall":
            customData = {
              package: func[id]["package"],
              module: func[id]["module"],
              function: func[id]["function"],
              arguments: func[id]["arguments"].map(item => ({"type": getTypeAndInput(inputs, item)[0], "value": getTypeAndInput(inputs, item)[1]})),
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
              coin: isGas ? func[id][0] : getTypeAndInput(inputs, func[id][0])[1],
              amounts: func[id][1].map(item => getTypeAndInput(inputs, item)[1]),
              backwardEdges: backwardEdgesList
            }
            break;
          case "MergeCoins":
            customData = {
              destinationCoin: getTypeAndInput(inputs, func[id][0])[1],
              sourceCoins: func[id][1].map(item => getTypeAndInput(inputs, item)[1])
            }
            break;
          case "MakeMoveVec":
            customData = {
              arguments: func[id][1].map(item => ({"type": getTypeAndInput(inputs, item)[0], "value": getTypeAndInput(inputs, item)[1]})),
              backwardEdges: getBackwardEdges(func[id][1])
            }
            break;
        }
        addNode(block, x, y, index > 0, customData, start);
      } else {
        addNode({
          id: "empty",
          title: id,
          icon: Ellipsis,
          node: EmptyNode
        }, x, y, index > 0, start);
      }
      x += 350;
    });
  }

  const executeTransaction = async () => {
    if (!wallet.connected) {
      toast({
        title: `Couldn't execute transaction`,
        description: `Please connect your wallet first`
      })
      return;
    }

    let dataEdges = edges.filter((edge) => edge.sourceHandle != "bottom" && edge.sourceHandle != "top");
    let controlEdges = edges.filter((edge) => edge.sourceHandle == "bottom" || edge.sourceHandle == "top");

    console.log("Nodes:", nodes);
    console.log("Data edges:", dataEdges);
    console.log("Control edges:", controlEdges);

    let nodeDictionary = nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

    let path = {}
    let incomingEdges = nodes.reduce((acc, node) => {
      acc[node.id] = 0;
      return acc;
    }, {});
    let outgoingEdges = nodes.reduce((acc, node) => {
      acc[node.id] = 0;
      return acc;
    }, {});
    controlEdges.forEach((edge) => {
      incomingEdges[edge.target] += 1;
      outgoingEdges[edge.source] += 1;
      path[edge.source] = edge.target;
    });
    let incomingEdgesCount = Object.values(incomingEdges).filter(value => value == 1).length;
    let outgoingEdgesCount = Object.values(outgoingEdges).filter(value => value == 1).length;
    if (incomingEdgesCount != nodes.length - 1 || outgoingEdgesCount != nodes.length - 1) {
      toast({
        title: `Couldn't execute transaction`,
        description: `Please make sure every node is connected in sequence`
      })
      return;
    }

    let sequence = [nodeDictionary[Object.keys(incomingEdges).filter(key => incomingEdges[key] == 0)[0]]];
    for (let i = 1; i < nodes.length; i += 1) {
      sequence.push(nodeDictionary[path[sequence[i - 1].id]])
    }
    console.log("Sequence:", sequence);

    try {
      let results = [];
      const tx = new Transaction();
      // const mint = tx.moveCall({
      //   target: '0x5b45da03d42b064f5e051741b6fed3b29eb817c7923b83b92f37a1d2abf4fbab::nft::mint',
      //   arguments: [tx.pure.string("name"), tx.pure.string("description"), tx.pure.string("url")],
      // });
      sequence.forEach((node) => {
        let result = null;
        switch (node.id) {

          case "TransferObjects":
            result = tx.transferObjects({
              objects: [],
              address: ""
            })
            break;

          case "MoveCall":
            result = tx.moveCall({
              target: "",
              arguments: [],
              typeArguments: []
            })
            break;

          case "MergeCoins":
            result = tx.mergeCoins({
              destination: "",
              sources: []
            })
            break;

          case "SplitCoins":
            result = tx.mergeCoins({
              coin: "",
              amounts: []
            })
            break;

          case "MakeMoveVec":
            result = tx.makeMoveVec({
              type: "",
              elements: []
            })
            break;
        }
        results.push(result);
      });

      // Setting the following line gives us more descriptive errors, but isn't necessary for execution
      // tx.setGasBudget(100000000);
      const resData = await wallet.signAndExecuteTransaction({transaction: tx});
      console.log("Resdata:", resData);
      toast({
        title: `Transaction executed!`,
        description: `https://suiscan.xyz/mainnet/tx/${resData.digest}`
      });
    } catch(e) {
      toast({
        title: `Couldn't execute transaction`,
        description: `${e}`,
        variant: "destructive"
      })
    } finally {
      return;
    }
  }

  return (
    <>
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
              <div className="flex">
                <ConnectButton style={{
                  fontSize: "14px",
                  marginRight: "16px"
                }}> Connect Wallet </ConnectButton>
                <Button type="submit" className="bg-sui hover:bg-sui hover:brightness-110 execute-button" style={{
                  borderRadius: "16px",
                  height: "48px",
                  paddingLeft: "32px",
                  paddingRight: "32px"
                }} onClick={executeTransaction}><b>Execute Transaction</b></Button>
              </div>
            </Panel>
            {nodes.length == 0 && <ViewportPortal>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center whitespace-normal p-4 max-w-sm break-words text-muted-foreground text-xl">
                Get started by searching for on-chain transactions or selecting components from the left sidebar
              </div>
            </ViewportPortal>}
          </ReactFlow>
      </div>
    </>
  );
}
