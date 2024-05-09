import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Acme Co",
  description: "Ecommerce for your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistMono.variable} ${GeistSans.variable}`}>
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
