"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ThemeProvider } from "@/components/theme-provider";

export function LandingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
        </main>
      </div>
    </ThemeProvider>
  );
}
