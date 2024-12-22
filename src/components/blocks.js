"use client";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
  } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

import { ChevronDown, Send, Parentheses, Split } from "lucide-react";

export const blocks = [
    {
        id: "TokenTransfer",
        title: "Token Transfer",
        icon: Send
    },
    {
        id: "MoveCall",
        title: "Move Call",
        icon: Parentheses
    },
    {
        id: "SplitCoins",
        title: "Split Coins",
        icon: Split
    }
]

export function Blocks({ onAddNode }) {
    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                    Basic Building Blocks
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {blocks.map((item, index) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild className="hover:cursor-pointer" onClick={() => onAddNode(item)}>
                                        <span><item.icon className="text-sui" />{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}
