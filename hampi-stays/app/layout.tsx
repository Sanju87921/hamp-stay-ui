import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HampiStays — Luxury Stays in Ancient Hampi",
  description:
    "Experience the grandeur of the Vijayanagara Empire seamlessly blended with world-class eco-hospitality. Book premium resorts in Hampi, Karnataka.",
  keywords: ["Hampi", "luxury resort", "heritage stay", "Karnataka", "booking"],
};

import { AuthProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
