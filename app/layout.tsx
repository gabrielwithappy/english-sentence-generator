import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';

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
    <html lang="en" className={GeistSans.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
