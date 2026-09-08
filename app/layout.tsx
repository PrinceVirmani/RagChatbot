import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

// Auth is disabled while we iterate on the RAG flow.
// Re-enable by uncommenting the imports + the wrapper JSX below.
// import ClientLayoutWrapper from "./_components/ClientLayoutWrapper";
// import { AuthProvider } from "./_components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "rag-pdf",
  description: "RAG over a fixed library of engineering PDFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <AuthProvider><ClientLayoutWrapper> */}
        {children}
        {/* </ClientLayoutWrapper></AuthProvider> */}
      </body>
    </html>
  );
}
