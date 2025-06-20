"use client";

import { User, Mail, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import Toggle from "@/components/Toggle";

// Disable static generation for authenticated pages
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { session, isLoading } = useAuth("/signin");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  const handleToggleChange = (setting: string) => (checked: boolean) => {
    console.log(`${setting} changed to:`, checked);
    // TODO: Implement settings save logic
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Lignes de grille en fond */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full border-r border-dashed border-[var(--foreground)]/10" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Profil & Paramètres</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations du profil */}
          <div className="rounded-lg border border-dashed border-[var(--foreground)]/20 bg-white/20 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/20">
                <User className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{session.user?.name || "Utilisateur"}</h2>
                <p className="text-[var(--foreground)]/60">{session.user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)]/80 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="flex items-center gap-2 rounded-md bg-white/10 p-2.5 border border-dashed border-[var(--foreground)]/20">
                  <User className="h-4 w-4 text-[var(--foreground)]/60" />
                  <span className="text-[var(--foreground)] font-semibold">{session.user?.name || "Non défini"}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)]/80 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-md bg-white/10 p-2.5 border border-dashed border-[var(--foreground)]/20">
                  <Mail className="h-4 w-4 text-[var(--foreground)]/60" />
                  <span className="text-[var(--foreground)] font-semibold">{session.user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="rounded-lg border border-dashed border-[var(--foreground)]/20 bg-white/20 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-[var(--accent)]" />
              <h2 className="text-xl font-semibold">Paramètres</h2>
            </div>

            <div className="space-y-4">
              <Toggle 
                label="Notifications email" 
                defaultChecked={true}
                onChange={handleToggleChange("email_notifications")}
              />
              <Toggle 
                label="Alertes de prix" 
                defaultChecked={true}
                onChange={handleToggleChange("price_alerts")}
              />
              <Toggle 
                label="Mode sombre" 
                defaultChecked={true}
                onChange={handleToggleChange("dark_mode")}
              />
            </div>

            <button className="group mt-6 w-full rounded-full bg-[var(--accent)] px-4 py-2 text-center font-semibold text-white shadow-lg transition-transform hover:scale-105">
              Sauvegarder les paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 