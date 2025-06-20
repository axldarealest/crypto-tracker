"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-dashed border-[var(--foreground)]/20">
      <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8 lg:py-12">
        <div className="mt-8 border-t border-[var(--foreground)]/10 pt-8 text-center">
          <p className="text-sm text-[var(--foreground)]/70">&copy; 2024 YouFi. Tous droits réservés par Axel Logan.</p>
        </div>
      </div>
    </footer>
  );
}
