import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidsponential - YouTube Trending Dashboard",
  description: "Track trending YouTube videos and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
