import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { DensityProvider } from "../context/DensityContext";
import { GlobalInspector } from "../components/GlobalInspector";
import { PasswordGate } from "../components/PasswordGate";

export const metadata: Metadata = {
  title: "PetroSquare Platform",
  description: "Vendor-neutral digital operating system for oil & gas",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/logo/petrosquare-mark.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text font-sans antialiased min-h-screen selection:bg-primary selection:text-white overflow-hidden">
        <DensityProvider>
          <PasswordGate>
            {children}
            <GlobalInspector />
          </PasswordGate>
        </DensityProvider>
      </body>
    </html>
  );
}
