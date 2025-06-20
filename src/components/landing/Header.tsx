"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "../Logo";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed border-[var(--foreground)]/20 bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={closeMenu}>
          <Logo size="md" />
        </Link>
        
        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#testimonials" className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors">
            Témoignages
          </Link>
        </nav>
        
        {/* CTA Buttons Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/signin">
            <button className="px-4 py-2 text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-white/20 rounded-lg transition-colors">
              Se connecter
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-lg transition-colors">
              Commencer
            </button>
          </Link>
        </div>

        {/* Menu Hamburger Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-[var(--foreground)] hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-dashed border-[var(--foreground)]/20 bg-[var(--background)]/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4 mb-4">
              <Link 
                href="#features" 
                className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors py-2"
                onClick={closeMenu}
              >
                Fonctionnalités
              </Link>
              <Link 
                href="#testimonials" 
                className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors py-2"
                onClick={closeMenu}
              >
                Témoignages
              </Link>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-dashed border-[var(--foreground)]/20">
              <Link href="/signin" onClick={closeMenu}>
                <button className="w-full px-4 py-3 text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-white/20 rounded-lg transition-colors text-left">
                  Se connecter
                </button>
              </Link>
              <Link href="/signup" onClick={closeMenu}>
                <button className="w-full px-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-lg transition-colors text-center">
                  Commencer
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
