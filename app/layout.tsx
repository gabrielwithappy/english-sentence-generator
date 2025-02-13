import "./globals.css";
import type { Metadata } from "next";
import Head from 'next/head';

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
    <>
      <Head>
        <title>{(metadata.title as string) || "Default Title"}</title>
        <meta name="description" content={(metadata.description as string) || "Default description."} />
      </Head>    
      <html lang="en">
        <body className="bg-gray-50">{children}</body>
      </html>
    </>
  );
}
