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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MoveCallNode = ({ data, selected }) => {
  const [packageValue, setPackageValue] = useState(data.package || "");
  const [moduleValue, setModuleValue] = useState(data.module || "");
  const [functionValue, setFunctionValue] = useState(data.function || "");
  const [argumentsList, setArgumentsList] = useState(data.arguments || []);
  const [outputsList, setOutputsList] = useState(data.outputs || []);

  const addArgument = () => {
    setArgumentsList((prev) => [...prev, { type: undefined, value: "" }]);
  };

  const removeArgument = (index) => {
    if (argumentsList.length > 0) {
      setArgumentsList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleArgumentChange = (value, index, field) => {
    setArgumentsList((prev) =>
      prev.map((arg, i) => (i === index ? { ...arg, [field]: value } : arg))
    );
  };

  const addOutput = () => {
    setOutputsList((prev) => [...prev, { value: "" }]);
  };

  const removeOutput = (index) => {
    if (outputsList.length > 0) {
      setOutputsList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleOutputChange = (value, index) => {
    setOutputsList((prev) =>
      prev.map((output, i) => (i === index ? { ...output, value } : output))
    );
  };

  return (
    <Card
      style={{
        border: selected ? "1px solid #555" : "1px solid #ddd",
      }}
    >
      <CardHeader className="bg-sui rounded-t-[inherit] text-white mb-4 p-4">
        <CardTitle className="flex items-center gap-2">
          <data.icon className="w-4 h-4" />
          <span className="ml-1">{data.label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Package Input */}
        <div className="flex items-start gap-2 mb-4 relative">
          <Handle
            type="target"
            position={Position.Left}
            id="left-package"
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
            <Label className="mb-2">Package:</Label>
            <Input
              value={packageValue}
              onChange={(e) => setPackageValue(e.target.value)}
              placeholder="Enter package address..."
            />
          </div>
        </div>

        {/* Module Input */}
        <div className="flex items-start gap-2 mb-4 relative">
          <Handle
            type="target"
            position={Position.Left}
            id="left-module"
            isConnectable={true}
            style={{
              marginTop: "10px",
              left: "-24px",
              position: "absolute",
              width: "10px",
              height: "5px",
              borderRadius: "0",
              border: "none"
            }}
          />
          <div className="flex flex-col w-full">
            <Label className="mb-2">Module:</Label>
            <Input
              value={moduleValue}
              onChange={(e) => setModuleValue(e.target.value)}
              placeholder="Enter module name..."
            />
          </div>
        </div>

        {/* Function Input */}
        <div className="flex items-start gap-2 mb-4 relative">
          <Handle
            type="target"
            position={Position.Left}
            id="left-function"
            isConnectable={true}
            style={{
              marginTop: "10px",
              left: "-24px",
              position: "absolute",
              width: "10px",
              height: "5px",
              borderRadius: "0",
              border: "none"
            }}
          />
          <div className="flex flex-col w-full">
            <Label className="mb-2">Function:</Label>
            <Input
              value={functionValue}
              onChange={(e) => setFunctionValue(e.target.value)}
              placeholder="Enter function name..."
            />
          </div>
        </div>

        {/* Arguments */}
        <div className="flex items-center gap-2">
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
              id={`left-argument-${index}`}
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
                  value={arg.type}
                  onValueChange={(value) => handleArgumentChange(value, index, "type")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Arg Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="address">Address</SelectItem>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="integer">Integer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Text Input for Argument Value */}
                <Input
                  value={arg.value}
                  onChange={(e) => handleArgumentChange(e.target.value, index, "value")}
                  placeholder="Enter arg value..."
                />
              </div>
            </div>

            {/* Remove Argument Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeArgument(index)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {/* Outputs */}
        <div className="flex items-center gap-2 mt-4">
          <Label>Outputs (read only):</Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={addOutput}
            className=""
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {outputsList.map((output, index) => (
          <div key={index} className="flex items-start gap-2 mb-2 relative">
            <Handle
              type="source"
              position={Position.Right}  // Right handle for outputs
              id={`right-output-${index}`}
              isConnectable={true}
              style={{
                right: "-24px", // Adjust spacing as needed
                position: "absolute",
                width: "10px",
                height: "5px",
                borderRadius: "0",
                border: "none"
              }}
            />
            <div className="flex flex-col w-full">
              <div className="flex gap-2">
                {/* Readonly Text Input for Output */}
                <Input
                  value={output.value}
                  onChange={(e) => handleOutputChange(e.target.value, index)}
                  placeholder={`Output value ${index}`}
                  readOnly
                />
              </div>
            </div>

            {/* Remove Output Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeOutput(index)}
            >
              <Trash className="w-4 h-4" />
            </Button>
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

export default memo(MoveCallNode);
