import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ReactFlowProvider } from '@xyflow/react';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sui Tx Builder",
  description: "Sui Transaction Builder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ReactFlowProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </ReactFlowProvider>
    </html>
  );
}
