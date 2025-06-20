"use client";

import Link from "next/link";
import { Wallet, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-green-400" />
          <span className="text-xl font-bold text-white">TrackFi</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-gray-300 hover:text-white">
            Fonctionnalités
          </Link>
          <Link href="#testimonials" className="text-sm text-gray-300 hover:text-white">
            Témoignages
          </Link>
          <Link
            href="/signin"
            className="rounded-md bg-gray-700 py-2 px-4 text-sm font-medium text-white hover:bg-gray-600"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700"
          >
            S'inscrire
          </Link>
        </nav>
        <button className="md:hidden">
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>
    </header>
  );
}
