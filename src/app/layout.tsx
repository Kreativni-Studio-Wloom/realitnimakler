import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "František Novák | Realitní makléř Praha a okolí",
  description: "Profesionální realitní služby – prodej, pronájem, odhad ceny, právní servis. Vaše jistota ve světě realit.",
  openGraph: {
    title: "František Novák | Realitní makléř Praha a okolí",
    description: "Profesionální realitní služby – prodej, pronájem, odhad ceny, právní servis. Vaše jistota ve světě realit.",
    type: "website",
    locale: "cs_CZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
