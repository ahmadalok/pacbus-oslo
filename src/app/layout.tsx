import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PacBus Oslo — Real-time Pacman Bus Tracker",
  description:
    "Watch Oslo buses as Pacman characters eating their way through the city in real-time. Powered by Entur.",
  openGraph: {
    title: "PacBus Oslo",
    description: "Gamified real-time bus tracking for Oslo, Norway",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mono.variable} h-full dark`}>
      <body className="h-full bg-gray-950 text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
