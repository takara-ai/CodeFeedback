"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, Moon, Sun, Menu, Trophy } from "lucide-react";
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
            The Ultimate Viber
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
          {/* Code */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:scale-105 transition-transform duration-300"
          >
            <Link href="/">Code</Link>
          </Button>
          {/* Vibe */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:scale-105 transition-transform duration-300"
          >
            <Link href="/prompting">Vibe</Link>
          </Button>
          {/* Leaderboard */}
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="hover:scale-105 transition-transform duration-300"
          >
            <Link href="/leaderboard">
              <Trophy className="w-4 h-4" />
                Leaderboard
            </Link>
          </Button>


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
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t bg-background/95 backdrop-blur transition-all duration-300 ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <nav className="container mx-auto px-4 py-4 space-y-4">
          {/* Code */}
          <Link
            href="/"
            className="block text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Code
          </Link>

          {/* Vibing */}
          <Link
            href="/prompting"
            className="block text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Vibe
          </Link>
          
          <div className="flex gap-2 pt-2">
            <Button size="sm" asChild>
              <Link href="/editor">Start Learning</Link>
            </Button>
          </div>

          {/* Leaderboard */}
          <Link href="/leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
                Leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
