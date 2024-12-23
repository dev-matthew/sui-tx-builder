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

const TransferObjectsNode = ({ data, selected }) => {
  const [inputs, setInputs] = useState(data.objects || [""]);
  const [to, setTo] = useState(data.to || "");

  const addInput = () => {
    setInputs((prev) => [...prev, ""]);
  };

  const removeInput = (index) => {
    if (inputs.length > 1) {
      setInputs((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (value, index) => {
    setInputs((prev) =>
      prev.map((input, i) => (i === index ? value : input))
    );
  };

  return (
    <Card
      style={{
        border: selected ? "1px solid #555" : "1px solid #ddd",
        width: "300px"
      }}
    >
      <CardHeader className="bg-sui rounded-t-[inherit] text-white mb-4 p-4">
        <CardTitle className="flex items-center gap-2">
          <data.icon className="w-4 h-4" />
          <span className="ml-1">{data.label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* "To" Field */}
        <div className="flex items-start gap-2 mb-4 relative">
          <Handle
            type="target"
            position={Position.Left}
            id="left-to"
            isConnectable={true}
            style={{
              marginTop: "10px",
              left: "-24px", // Adjust spacing as needed
              position: "absolute",
              width: "10px",
              height: "5px",
              borderRadius: "0",
              border: "none"
            }}
          />
          <div className="flex flex-col w-full">
            <Label className="mb-2">Destination Address:</Label>

            <Input placeholder="Enter an address..." value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        {/* Objects to Transfer */}
        <div className="flex items-center gap-2">
          <Label>Objects to transfer:</Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={addInput}
            className=""
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {inputs.map((input, index) => (
          <div key={index} className="flex items-start gap-2 mb-2 relative">
            <Handle
              type="target"
              position={Position.Left}
              id={`left-input-${index}`}
              isConnectable={true}
              style={{
                left: "-24px", // Adjust spacing as needed
                position: "absolute",
                width: "10px",
                height: "5px",
                borderRadius: "0",
                border: "none"
              }}
            />
            <div className="flex flex-col w-full">
              <Input
                value={input}
                onChange={(e) => handleInputChange(e.target.value, index)}
                placeholder="Enter an object address..."
              />
            </div>
            {index > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeInput(index)}
              >
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
          height: "10px"
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={true}
        style={{
          width: "10px",
          height: "10px"
        }}
      />
    </Card>
  );
};

export default memo(TransferObjectsNode);
