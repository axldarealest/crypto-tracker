"use client";

import { SessionProvider } from "next-auth/react";

// Disable static generation for all auth pages
export const dynamic = 'force-dynamic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 