import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetroSquare Platform",
  description: "Vendor-neutral digital operating system for oil & gas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text font-sans antialiased min-h-screen selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
