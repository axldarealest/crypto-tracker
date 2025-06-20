"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";

function UserDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!session) return null;

  const displayName = session.user?.name || session.user?.email;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-lg bg-white/20 px-2 py-2 text-[var(--foreground)] hover:bg-white/30 transition-colors backdrop-blur-sm border border-dashed border-[var(--foreground)]/20 sm:px-3"
        aria-label="Menu utilisateur"
        aria-expanded={isOpen}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/20 sm:h-8 sm:w-8">
          <User className="h-3 w-3 text-[var(--accent)] sm:h-4 sm:w-4" />
        </div>
        <span className="hidden text-sm font-semibold sm:block">{displayName}</span>
        <ChevronDown className={`h-3 w-3 transition-transform sm:h-4 sm:w-4 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white/20 shadow-sm border border-dashed border-[var(--foreground)]/20 backdrop-blur-sm z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs text-[var(--foreground)]/60 border-b border-dashed border-[var(--foreground)]/20">
              Connecté en tant que
            </div>
            <div className="px-3 py-2 text-sm text-[var(--foreground)] font-semibold truncate">
              {session.user?.email}
            </div>
          </div>
          
          <div className="p-1">
            <Link 
              href="/profile"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--foreground)]/80 hover:bg-white/20 hover:text-[var(--foreground)] transition-colors"
              onClick={closeDropdown}
            >
              <Settings className="h-4 w-4" />
              Profil & Paramètres
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(UserDropdown); 