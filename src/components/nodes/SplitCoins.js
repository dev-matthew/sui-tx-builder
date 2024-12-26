import { memo, useState } from "react";
import { Handle, Position, useReactFlow, useEdges } from '@xyflow/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SplitCoinsNode = ({ id, data, selected }) => {
  const [coin, setCoin] = useState(data.coin || "");
  const [amounts, setAmounts] = useState(data.amounts || [""]);
  const { updateNodeData } = useReactFlow();
  const edges = useEdges();
  let incomingDataEdges = edges.filter((edge) => edge.target == id && edge.targetHandle.includes("left")).map((edge) => edge.targetHandle);

  const addAmount = () => {
    const newAmounts = [...amounts, ""];
    setAmounts(newAmounts);
    updateNodeData(id, { amounts: newAmounts });
  };

  const removeAmount = (index) => {
    if (amounts.length > 1) {
      const newAmounts = amounts.filter((_, i) => i !== index);
      setAmounts(newAmounts);
      updateNodeData(id, { amounts: newAmounts });
      data.removeHandleCallback(id, `left-${index}`);
      data.removeHandleCallback(id, `right-${index}`);
    }
  };

  const handleAmountChange = (value, index) => {
    const newAmounts = amounts.map((amount, i) => (i === index ? value : amount));
    setAmounts(newAmounts);
    updateNodeData(id, { amounts: newAmounts });
  };

  const handleCoinChange = (value) => {
    setCoin(value);
    updateNodeData(id, { coin: value });
  }

  return (
    <Card
      style={{
        border: selected ? "1px solid #555" : "1px solid #ddd",
        width: "300px",
      }}
    >
      <CardHeader className="bg-sui rounded-t-[inherit] text-white mb-4 p-4">
        <TooltipProvider>
          <CardTitle className="flex items-center gap-2">
            <data.icon className="w-4 h-4" />
            <span className="ml-1">{data.label}</span>
            <div className="ml-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Creates new coins with the defined amounts, split from the provided coin. Returns the coins so that it can be used in subsequent transactions.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardTitle>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        {/* Coin Field */}
        <div className="flex items-start gap-2 mb-4 relative">
          <Handle
            type="target"
            position={Position.Left}
            id="left-coin"
            isConnectable={true}
            style={{
              marginTop: "10px",
              left: "-24px",
              position: "absolute",
              width: "10px",
              height: "5px",
              borderRadius: "0",
              border: "none",
            }}
          />
          <div className="flex flex-col w-full">
            <Label className="mb-2">Coin:</Label>
            <Input
              placeholder={incomingDataEdges.includes("left-coin") ? "RESULT" : "Enter a coin..."}
              value={incomingDataEdges.includes("left-coin") ? "" : coin}
              className={incomingDataEdges.includes("left-coin") ? "cursor-not-allowed" : ""}
              readOnly={incomingDataEdges.includes("left-coin")}
              onChange={(e) => handleCoinChange(e.target.value)}
            />
          </div>
        </div>

        {/* Amounts to Transfer */}
        <div className="flex items-center gap-2">
          <Label>Amounts and outputs:</Label>
          <Button variant="ghost" size="icon" onClick={addAmount}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {amounts.map((amount, index) => (
          <div key={index} className="flex items-start gap-2 mb-2 relative">
            <Handle
              type="target"
              position={Position.Left}
              id={`left-${index}`}
              isConnectable={true}
              style={{
                left: "-24px",
                position: "absolute",
                width: "10px",
                height: "5px",
                borderRadius: "0",
                border: "none",
              }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id={`right-${index}`}
              isConnectable={true}
              style={{
                right: "-24px",
                position: "absolute",
                width: "10px",
                height: "5px",
                borderRadius: "0",
                border: "none",
              }}
            />
            <div className="flex flex-col w-full">
              <Input
                value={incomingDataEdges.includes(`left-${index}`) ? "" : amount}
                onChange={(e) => handleAmountChange(e.target.value, index)}
                placeholder={incomingDataEdges.includes(`left-${index}`) ? "RESULT" : "Enter an amount..."}
                className={incomingDataEdges.includes(`left-${index}`) ? "cursor-not-allowed" : ""}
                readOnly={incomingDataEdges.includes(`left-${index}`)}
              />
            </div>
            {amounts.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeAmount(index)}>
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={true}
        style={{
          width: "10px",
          height: "10px",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={true}
        style={{
          width: "10px",
          height: "10px",
        }}
      />
    </Card>
  );
};

export default memo(SplitCoinsNode);
