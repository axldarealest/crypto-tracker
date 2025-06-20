"use client";

import { useSession } from "next-auth/react";
import GlobalHeader from "./GlobalHeader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <>
      {session && <GlobalHeader />}
      <main className={session ? "pt-16" : ""}>
        {children}
      </main>
    </>
  );
} 