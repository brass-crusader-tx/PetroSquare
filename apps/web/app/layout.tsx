import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { DensityProvider } from "../context/DensityContext";
import { GlobalInspector } from "../components/GlobalInspector";
import { Gate } from "../components/Gate";

export const metadata: Metadata = {
  title: "PetroSquare Platform",
  description: "Vendor-neutral digital operating system for oil & gas",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
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
      <body className="bg-background text-text font-sans antialiased min-h-screen selection:bg-primary selection:text-white">
        <DensityProvider>
          <Gate>
            {children}
            <GlobalInspector />
          </Gate>
        </DensityProvider>
      </body>
    </html>
  );
}
