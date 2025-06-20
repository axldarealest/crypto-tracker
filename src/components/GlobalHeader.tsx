"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import UserDropdown from "./UserDropdown";

export default function GlobalHeader() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-green-400" />
          <span className="text-xl font-bold text-white">TrackFi</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/portfolio" 
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Portfolio
          </Link>
          <Link 
            href="/markets" 
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Marchés
          </Link>
        </nav>

        <UserDropdown />
      </div>
    </header>
  );
} 