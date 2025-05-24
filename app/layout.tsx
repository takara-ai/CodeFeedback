import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LangCode - Learn to Build with Language",
  description:
    "Master natural language programming and learn to collaborate with AI to create software. The future of coding is conversational.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
