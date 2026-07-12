import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Profirm OS",
  description: "Profirm Group — venture management operating system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* A CSS @import in globals.css gets pushed past position 0 by
            webpack's module concatenation (next/font's generated @font-face
            rules land first), so browsers silently drop it. A <link> tag —
            what the Stitch mockups themselves use — isn't affected. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- false
            positive: this rule predates the App Router and doesn't know a
            root layout's <head> applies to every route, not one page. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-surface text-on-surface overflow-x-hidden">{children}</body>
    </html>
  );
}
