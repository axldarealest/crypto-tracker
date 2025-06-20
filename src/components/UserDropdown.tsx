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
        className="flex items-center gap-2 rounded-lg bg-gray-800/60 px-3 py-2 text-white hover:bg-gray-700/60 transition-colors backdrop-blur-sm"
        aria-label="Menu utilisateur"
        aria-expanded={isOpen}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
          <User className="h-4 w-4 text-green-400" />
        </div>
        <span className="text-sm font-medium">{displayName}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-gray-800 shadow-xl border border-gray-700 backdrop-blur-sm z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
              Connecté en tant que
            </div>
            <div className="px-3 py-2 text-sm text-white truncate">
              {session.user?.email}
            </div>
          </div>
          
          <div className="p-1">
            <Link 
              href="/profile"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={closeDropdown}
            >
              <Settings className="h-4 w-4" />
              Profil & Paramètres
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
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