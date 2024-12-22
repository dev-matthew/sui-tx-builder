import { memo, useState } from "react";

import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(false)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "10px",
        border: selected ? "1px solid #555" : "1px solid #ddd", // Darker border when selected
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        position: "relative"
      }}
    >
      {data.label}
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={true}
      />
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "5px",
            padding: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            borderRadius: "3px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          {data.metadata}
        </div>
      )}
    </div>
  );
};

export default memo(CustomNode);
