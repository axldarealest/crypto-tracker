"use client";

import { User, Mail, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import Toggle from "@/components/Toggle";

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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Profil & Paramètres</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations du profil */}
          <div className="rounded-lg bg-gray-800/60 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <User className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{session.user?.name || "Utilisateur"}</h2>
                <p className="text-gray-400">{session.user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="flex items-center gap-2 rounded-md bg-gray-700 p-2.5">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{session.user?.name || "Non défini"}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-md bg-gray-700 p-2.5">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{session.user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="rounded-lg bg-gray-800/60 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-400" />
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

            <button className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 text-center font-medium text-white hover:bg-green-700 transition-colors">
              Sauvegarder les paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 