import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/SessionProvider";
import Navbar from "./components/Navbar";


export const metadata: Metadata = {
  title: "shopstrider",
  description: "shopstrider.com is your first destination to check out latest tech and apparels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SessionProvider>
          <Navbar />
          <main className="w-full">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}

