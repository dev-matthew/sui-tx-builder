import { memo, useState } from "react";
import { Handle, Position, useReactFlow } from '@xyflow/react';
import {
  Card,
  CardContent,
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

const MergeCoinsNode = ({ id, data, selected }) => {
  const [destinationCoin, setDestinationCoin] = useState(data.destinationCoin || "");
  const [sourceCoins, setSourceCoins] = useState(data.sourceCoins || [""]);
  const { updateNodeData } = useReactFlow();

  const addSourceCoin = () => {
    const newCoins = [...sourceCoins, ""];
    setSourceCoins(newCoins);
    updateNodeData(id, {sourceCoins: newCoins});
  };

  const removeSourceCoin = (index) => {
    if (sourceCoins.length > 1) {
      const newCoins = sourceCoins.filter((_, i) => i !== index);
      setSourceCoins(newCoins);
      updateNodeData(id, {sourceCoins: newCoins});
    }
  };

  const handleSourceCoinChange = (value, index) => {
    const newCoins = sourceCoins.map((coin, i) => (i === index ? value : coin));
    setSourceCoins(newCoins);
    updateNodeData(id, {sourceCoins: newCoins});
  };

  const handleDestinationCoinChange = (value) => {
    setDestinationCoin(value);
    updateNodeData(id, {destinationCoin: value});
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
                  <p>Merges the source coins into the destination coin.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardTitle>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        {/* Destination Coin */}
        <div className="flex items-start gap-2 mb-4 relative">
          <Handle
            type="target"
            position={Position.Left}
            id="left-destination"
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
            <Label className="mb-2">Destination Coin:</Label>
            <Input
              placeholder="Enter destination coin..."
              value={destinationCoin}
              onChange={(e) => handleDestinationCoinChange(e.target.value)}
            />
          </div>
        </div>

        {/* Source Coins */}
        <div className="flex items-center gap-2">
          <Label>Source Coins:</Label>
          <Button variant="ghost" size="icon" onClick={addSourceCoin}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {sourceCoins.map((coin, index) => (
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
            <div className="flex flex-col w-full">
              <Input
                value={coin}
                onChange={(e) => handleSourceCoinChange(e.target.value, index)}
                placeholder="Enter source coin..."
              />
            </div>
            {index > 0 && (
              <Button variant="ghost" size="icon" onClick={() => removeSourceCoin(index)}>
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

export default memo(MergeCoinsNode);
