"use client";

import { useState } from "react";
import Image from "next/image";

import { Github, LoaderCircle } from "lucide-react";

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
 
export function AppSidebar({ onAddNode, onSearch }) {
  const [loading, setLoading] = useState(false);
  const [transactionDigest, setTransactionDigest] = useState("");
  const { toast } = useToast()

  const handleInputChange = (event) => {
    setTransactionDigest(event.target.value);
  };

  const handleSearchClick = async () => {
    if (loading) {
      toast({
        title: `Search already in progress`,
        description: `Please wait a few seconds and try again`
      })
      return;
    }
    setLoading(true);
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
      if (data.result == null) {
        throw new Error(`Error: ${response.status}`);
      }
      onSearch(data);
    } catch (error) {
      toast({
        title: `Couldn't find ${transactionDigest}`,
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false);
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
        <SidebarGroupLabel className="font-bold text-2xl text-gray-900 mt-4">
          <Image src="/Sui_Symbol_Sea.svg" alt="Sui Logo" width={24} height={24} className="mr-4 ml-1" />
          <span className="mt-1">Sui Transaction Builder</span>
        </SidebarGroupLabel>
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
                disabled={loading}
                className="bg-sui hover:bg-sui hover:brightness-110"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin w-5 h-5" />
                ) : (
                  "Search"
                )}
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
