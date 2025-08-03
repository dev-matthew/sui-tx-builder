import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
  } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

import { ChevronDown, FilePlus2, Trash, TextSelect, SendToBack } from "lucide-react";

import NFTMint from "@/components/templates/NFTMint.json"
import SendTokens from "@/components/templates/SendTokens.json"


const templates = [
    {
        title: "NFT Mint",
        icon: FilePlus2,
        data: NFTMint
    },
    {
        title: "Send Tokens",
        icon: SendToBack,
        data: SendTokens
    }
]

export function Templates({ onAddTemplate }) {
    const deleteTemplate = (titleToDelete) => {
        const localTemplates = localStorage.getItem("localTemplates");
        if (!localTemplates) return;
        
        const templates = JSON.parse(localTemplates);
        const updatedTemplates = templates.filter(t => t.title !== titleToDelete);
        
        localStorage.setItem("localTemplates", JSON.stringify(updatedTemplates));
        
        alert(`Deleted template "${titleToDelete}". Refresh the page to update.`);
    };

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
                            {(localStorage.getItem("localTemplates") ? JSON.parse(localStorage.getItem("localTemplates")) : []).map((item2) => (
                                <SidebarMenuItem key={item2.title}>
                                    <div className="flex items-center justify-between w-full">
                                    {/* Main Template Button */}
                                    <SidebarMenuButton
                                        asChild
                                        className="flex-1 text-left hover:cursor-pointer"
                                        onClick={() => onAddTemplate(item2.data)}
                                    >
                                        <span className="flex items-center gap-2">
                                        <TextSelect className="text-sui" />
                                        {item2.title}
                                        </span>
                                    </SidebarMenuButton>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                        e.stopPropagation(); // prevent triggering parent click
                                        deleteTemplate(item2.title);
                                        }}
                                        className="ml-2 p-1 rounded hover:bg-red-100 text-red-500"
                                        title="Delete template"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                    </div>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}
