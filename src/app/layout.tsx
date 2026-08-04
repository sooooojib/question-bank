import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Question Bank",
  description:
    "Browse, search, and upload past exam questions organized by course, semester, and year. A premium university question bank.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="
          min-h-full flex flex-col
          bg-slate-950 text-slate-100
        "
      >
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
