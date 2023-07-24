import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "SquareOne AI assistant",
  description: "SquareOne AI Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="p-10 bg-white bg-opacity-70">{children}</body>
    </html>
  );
}
