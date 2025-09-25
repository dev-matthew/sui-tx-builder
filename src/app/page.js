"use client";

import { WalletProvider, SuiMainnetChain, SlushWallet } from '@suiet/wallet-kit';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactFlowProvider } from '@xyflow/react';
import { Toaster } from "@/components/ui/toaster";
import Main from '@/components/main';

export default function Page() {
  return (
    <WalletProvider chains={[SuiMainnetChain]}>
      <ReactFlowProvider>
        <SidebarProvider
          style={{
            "--sidebar-width": "24rem"
          }}
        >
          <Main />
          <Toaster />
        </SidebarProvider>
      </ReactFlowProvider>
    </WalletProvider>
  );
}
