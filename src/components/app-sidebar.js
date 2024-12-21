"use client";

import { useState } from "react";

import { Github } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Blocks } from "@/components/blocks";
import { Templates } from "@/components/templates";
 
export function AppSidebar({ onAddNode }) {
  const [transactionDigest, setTransactionDigest] = useState("");
  const { toast } = useToast()

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

      if (data.result == null) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      toast({
        title: `Couldn't find ${transactionDigest}`,
        description: error.message,
        variant: "destructive"
      })
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel className="font-bold text-2xl text-gray-900 mt-4">Sui Transaction Builder</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Inspect Existing Transactions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Enter transaction digest..."
                value={transactionDigest}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="ml-2"
              />
              <Button
                type="submit"
                onClick={handleSearchClick}
              >
                Search
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <Blocks onAddNode={onAddNode}/>
        <Templates />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex h-5 items-center space-x-4 text-sm justify-between w-full">
          <SidebarGroupLabel>Data provided by the&nbsp;<a href="https://blockberry.one" target="_blank"><b>Blockberry API</b></a></SidebarGroupLabel>
          <Separator orientation="vertical" />
          <SidebarGroupLabel><a href="https://github.com/dev-matthew/sui-tx-builder" target="_blank" className="flex items-center"><Github className="mr-2"></Github><b>Source Code</b></a></SidebarGroupLabel>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
