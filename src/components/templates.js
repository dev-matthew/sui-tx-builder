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

import { ChevronDown, FilePlus2, HandCoins } from "lucide-react";

const templates = [
    {
        title: "NFT Mint",
        icon: FilePlus2
    },
    {
        title: "Airdrop",
        icon: HandCoins
    }
]

export function Templates() {
    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                    Templates
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {templates.map((item, index) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="hover:cursor-pointer">
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
