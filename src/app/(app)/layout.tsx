"use client";

import { SessionProvider } from "next-auth/react";
import ClientLayout from "@/components/ClientLayout";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ClientLayout>
        {children}
      </ClientLayout>
    </SessionProvider>
  );
} 