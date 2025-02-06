import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Sentence Generator",
  description: "Generate English sentences with translations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
