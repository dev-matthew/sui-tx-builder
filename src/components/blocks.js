import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
  } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, Send, Parentheses, Split, StickyNote, Merge, ListFilter } from "lucide-react";
import TransferObjects from "@/components/nodes/TransferObjects";
import MoveCall from "@/components/nodes/MoveCall";
import SplitCoins from "@/components/nodes/SplitCoins";
import MergeCoins from "@/components/nodes/MergeCoins";
import MakeMoveVec from "@/components/nodes/MakeMoveVec";

export const blocks = [
    {
        id: "TransferObjects",
        title: "Transfer Objects",
        icon: Send,
        node: TransferObjects
    },
    {
        id: "MoveCall",
        title: "Move Call",
        icon: Parentheses,
        node: MoveCall
    },
    {
        id: "SplitCoins",
        title: "Split Coins",
        icon: Split,
        node: SplitCoins
    },
    {
        id: "MergeCoins",
        title: "Merge Coins",
        icon: Merge,
        node: MergeCoins
    },
    {
        id: "MakeMoveVec",
        title: "Make Move Vector",
        icon: ListFilter,
        node: MakeMoveVec
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
