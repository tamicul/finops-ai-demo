import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinOps AI - Financial Intelligence Platform",
  description: "AI-powered financial operations for modern startups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-[#0a0a0a] text-white`}>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}// Wed Feb 18 23:06:38 EST 2026
// force rebuild Wed Feb 18 23:43:44 EST 2026
