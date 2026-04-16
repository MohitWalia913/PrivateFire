import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Private Fire — Private Wildfire Protection",
  description: "Geo-based private fire protection services for homeowners in wildfire-prone areas. Apply for coverage in limited annual service slots, track active fires, and protect what matters most.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8f7f5] text-gray-900">
        <SessionProviderWrapper>
          <Navbar />
          <main className="flex-1">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
