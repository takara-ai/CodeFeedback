"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 animate-slide-down">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl group"
        >
          <MessageSquare className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          <span className="group-hover:text-blue-600 transition-colors duration-300">
            LangCode
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-9 h-9 hover:scale-110 transition-transform duration-300"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* CTA Buttons */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:scale-105 transition-transform duration-300"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="hover:scale-105 transition-all duration-300 hover:shadow-lg group"
          >
            <Link href="/editor">
              Start Learning
              <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t bg-background/95 backdrop-blur transition-all duration-300 ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <nav className="container mx-auto px-4 py-4 space-y-4">
          <Link
            href="#features"
            className="block text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Learning Path
          </Link>
          <Link
            href="#pricing"
            className="block text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#docs"
            className="block text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Guides
          </Link>
          <Link
            href="#about"
            className="block text-sm font-medium hover:text-blue-600 transition-colors"
          >
            About
          </Link>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/editor">Start Learning</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
