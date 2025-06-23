import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Naranjillo Corp",
  description: "Sistema de monitoreo y control de cuyes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>{children}</body>
    </html>
  );
}
