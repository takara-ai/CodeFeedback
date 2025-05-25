import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "VibeLearning - Master AI Prompt Engineering",
  description:
    "Learn to craft perfect prompts for AI code generation. Master the art of communicating with AI to create better software through strategic prompt engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
