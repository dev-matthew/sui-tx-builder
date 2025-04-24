import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
  } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

import { ChevronDown, FilePlus2, HandCoins, CircleDollarSign } from "lucide-react";

import NFTMint from "@/components/templates/NFTMint.json"

const templates = [
    {
        title: "NFT Mint",
        icon: FilePlus2,
        data: NFTMint
    },
    {
        title: "Create Token",
        icon: CircleDollarSign
    },
    {
        title: "Airdrop",
        icon: HandCoins
    }
]

export function Templates({ onAddTemplate }) {
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
                                    <SidebarMenuButton asChild className="hover:cursor-pointer" onClick={() => onAddTemplate(item.data)}>
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
