import { memo, useState } from "react";
import { Handle, Position } from '@xyflow/react';
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
import { Plus, Trash } from "lucide-react";

const SplitCoinsNode = ({ data, selected }) => {
  const [coin, setCoin] = useState(data.coin || "");
  const [amounts, setAmounts] = useState(data.amounts || [""]);

  const addAmount = () => {
    setAmounts((prev) => [...prev, ""]);
  };

  const removeAmount = (index) => {
    if (amounts.length > 1) {
      setAmounts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAmountChange = (value, index) => {
    setAmounts((prev) =>
      prev.map((amount, i) => (i === index ? value : amount))
    );
  };

  return (
    <Card
      style={{
        border: selected ? "1px solid #555" : "1px solid #ddd",
        width: "300px",
      }}
    >
      <CardHeader className="bg-sui rounded-t-[inherit] text-white mb-4 p-4">
        <CardTitle className="flex items-center gap-2">
          <data.icon className="w-4 h-4" />
          <span className="ml-1">{data.label}</span>
        </CardTitle>
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
              placeholder="Enter a coin..."
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
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
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value, index)}
                placeholder="Enter an amount..."
              />
            </div>
            {index > 0 && (
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
