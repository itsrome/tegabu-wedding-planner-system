import type { Metadata } from "next";
import "./globals.css";
import KeepAlive from "@/components/KeepAlive";

export const metadata: Metadata = {
  title: "Tegabu Wedding Planner",
  description: "Plan your perfect wedding day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <KeepAlive />
        {children}
      </body>
    </html>
  );
}
