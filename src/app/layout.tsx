import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import TerminalHeader from "@/components/layout/TerminalHeader";
import TerminalFooter from "@/components/layout/TerminalFooter";
import SessionProvider from "@/components/auth/SessionProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sudo update // Community Intel Network",
  description: "A full-stack, community-driven news dispatch platform with a dark-mode terminal aesthetic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0e14] text-[#e5e7eb] font-mono selection:bg-[#00ff66] selection:text-black">
        {/* Simulated CRT Scanlines */}
        <div className="fixed inset-0 terminal-scanlines z-50 pointer-events-none opacity-40" />

        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <TerminalHeader />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <TerminalFooter />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
