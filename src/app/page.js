"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [transactionDigest, setTransactionDigest] = useState("");

  const handleInputChange = (event) => {
    setTransactionDigest(event.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionDigest }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
          placeholder="Enter transaction digest..."
          value={transactionDigest}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
      />
      <Button type="submit" onClick={handleSearchClick}>
          Search
      </Button>
    </div>
  );
}
