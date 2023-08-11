import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";

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
          <div className="flex flex-col border-r border-[#1ad197] pr-5">
            <h3 className="text-3xl mb-5 text-[#1ad197] font-bold flex flex-col">
              <span>Welcome to the</span>
              <span>SquareOne AI Project</span>
            </h3>
            <div className="flex flex-col space-y-4 w-80">
              <Link className="text-md opacity-70 underline" href="/">
                Assistant and Product search
              </Link>
              <Link className="text-md opacity-70 underline" href="/products">
                Products
              </Link>
              <Link
                className="text-md opacity-70 underline"
                title="Visit Square One"
                href={process.env.NEXT_PUBLIC_SO_URL as string}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit the Square One store
              </Link>
            </div>
          </div>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </body>
    </html>
  );
}
