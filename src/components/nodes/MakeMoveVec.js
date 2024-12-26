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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MakeMoveVecNode = ({ id, data, selected }) => {
  const [argumentsList, setArgumentsList] = useState(data.arguments || [{type: undefined, value: ""}]);
  const { updateNodeData } = useReactFlow();
  const edges = useEdges();
  let incomingDataEdges = edges.filter((edge) => edge.target == id && edge.targetHandle.includes("left")).map((edge) => edge.targetHandle);

  const addArgument = () => {
    const newArguments = [...argumentsList, {type: undefined, value: ""}]
    setArgumentsList(newArguments);
    updateNodeData(id, {arguments: newArguments});
  };

  const removeArgument = (index) => {
    if (argumentsList.length > 0) {
      const newArguments = argumentsList.filter((_, i) => i !== index)
      setArgumentsList(newArguments);
      updateNodeData(id, {arguments: newArguments});
    }
  };

  const handleArgumentChange = (value, index, field) => {
    const newArguments = argumentsList.map((arg, i) => (i === index ? { ...arg, [field]: value } : arg))
    setArgumentsList(newArguments);
    updateNodeData(id, {arguments: newArguments});
  };

  return (
    <Card
      style={{
        border: selected ? "1px solid #555" : "1px solid #ddd",
        width: "300px"
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
                  <p>Constructs a vector of objects that can be passed into a moveCall. This is required as there's no way to define a vector as an input.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardTitle>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          {/* Arguments */}
          <div className="flex items-center gap-2 -mt-3">
            <Label>Arguments:</Label>
            <Button
              variant="ghost"
              size="icon"
              onClick={addArgument}
              className=""
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {argumentsList.map((arg, index) => (
            <div key={index} className="flex items-start gap-2 mb-2 relative">
              <Handle
                type="target"
                position={Position.Left}
                id={`left-${index}`}
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
                <div className="flex gap-2">
                  {/* Select Component for Argument Type */}
                  <Select
                    value={incomingDataEdges.includes(`left-${index}`) ? "result" : arg.type}
                    onValueChange={(value) => handleArgumentChange(value, index, "type")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Arg Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Object</SelectLabel>
                        <SelectItem value="object">object</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Result (draw an arrow)</SelectLabel>
                        <SelectItem value="result">result</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Pure</SelectLabel>
                        <SelectItem value="address">address</SelectItem>
                        <SelectItem value="bool">bool</SelectItem>
                        <SelectItem value="string">string</SelectItem>
                        <SelectItem value="u8">u8</SelectItem>
                        <SelectItem value="u16">u16</SelectItem>
                        <SelectItem value="u32">u32</SelectItem>
                        <SelectItem value="u64">u64</SelectItem>
                        <SelectItem value="u128">u128</SelectItem>
                        <SelectItem value="u256">u256</SelectItem>
                        <SelectItem value="vector">vector</SelectItem>
                        <SelectItem value="option">option</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {/* Text Input for Argument Value */}
                  <Input
                    value={incomingDataEdges.includes(`left-${index}`) ? "" : arg.value}
                    onChange={(e) => handleArgumentChange(e.target.value, index, "value")}
                    placeholder={incomingDataEdges.includes(`left-${index}`) || arg.type == "result" ? "RESULT" : "Enter value..."}
                    readOnly={incomingDataEdges.includes(`left-${index}`) || arg.type == "result"}
                    className={incomingDataEdges.includes(`left-${index}`) || arg.type == "result" ? "cursor-not-allowed" : ""}
                  />
                </div>
              </div>

              {/* Remove Argument Button */}
              {argumentsList.length > 1 && <Button
                variant="ghost"
                size="icon"
                onClick={() => removeArgument(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>}
            </div>
          ))}
        </TooltipProvider>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Label>Output:</Label>
        <div className="flex items-start gap-2 relative">
        <Handle
            type="source"
            position={Position.Right}
            id={`right-0`}
            isConnectable={true}
            style={{
                right: "-24px",
                position: "absolute",
                width: "10px",
                height: "5px",
                borderRadius: "0",
                border: "none"
            }}
        />
          <Input
            readOnly
            className="cursor-not-allowed"
            placeholder="Output vector"
          />
        </div>
      </CardFooter>
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

export default memo(MakeMoveVecNode);
