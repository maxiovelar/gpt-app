import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

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
      <body className="m-10 bg-white bg-opacity-70">
        <div className="flex space-x-5">
          <div className="flex flex-col border-r border-[#1ad197] pr-5 w-96">
            <h3 className="text-3xl mb-5 text-[#1ad197] font-bold flex flex-col">
              <span>Welcome to the</span>
              <span>SquareOne AI Assistant</span>
            </h3>
            <Link
              className="text-md opacity-70 mt-10 underline"
              title="Visit Square One"
              href="https://squareone.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the Square One store
            </Link>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
