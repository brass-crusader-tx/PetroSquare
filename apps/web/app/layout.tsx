import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { DensityProvider } from "../context/DensityContext";
import { GlobalInspector } from "../components/GlobalInspector";
import { AccessGate } from "../components/AccessGate";

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
        <DensityProvider>
          <AccessGate>
            {children}
            <GlobalInspector />
          </AccessGate>
        </DensityProvider>
      </body>
    </html>
  );
}
