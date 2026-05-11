import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "PaddleMate", template: "%s | PaddleMate" },
  description: "Book padel courts, find players at your level, and manage your club — all in one place. The UK's smarter padel booking platform.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  metadataBase: new URL("https://www.paddlemate.co.uk"),
  openGraph: {
    type: "website",
    siteName: "PaddleMate",
    title: "PaddleMate — Book Courts. Find Players. Own the Court.",
    description: "Book padel courts, find players at your level, and manage your club — all in one place. The UK's smarter padel booking platform.",
    url: "https://www.paddlemate.co.uk",
    images: [{ url: "/icon.svg", width: 200, height: 200, alt: "PaddleMate" }],
  },
  twitter: {
    card: "summary",
    title: "PaddleMate — Book Courts. Find Players.",
    description: "Book padel courts, find players at your level, and manage your club — all in one place.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
