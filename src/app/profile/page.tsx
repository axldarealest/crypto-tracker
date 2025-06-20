"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    redirect("/signin");
  }

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
              <div className="flex items-center justify-between rounded-md bg-gray-700 p-3">
                <span className="text-sm">Notifications email</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-md bg-gray-700 p-3">
                <span className="text-sm">Alertes de prix</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-md bg-gray-700 p-3">
                <span className="text-sm">Mode sombre</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
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