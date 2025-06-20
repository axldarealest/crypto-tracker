"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Menu, X } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { Logo } from "./Logo";

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/marches', label: 'Marchés' },
];

export function GlobalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed border-[var(--foreground)]/20 bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" onClick={closeMenu}>
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  pathname === href
                    ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Menu & Hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <UserDropdown />
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-[var(--foreground)] hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-dashed border-[var(--foreground)]/20 bg-[var(--background)]/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2 mb-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`px-3 py-3 text-base font-semibold rounded-lg transition-colors ${
                    pathname === href
                      ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                      : 'text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-dashed border-[var(--foreground)]/20">
              <UserDropdown />
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 