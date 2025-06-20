"use client";

import Link from "next/link";
import { Wallet, Mail, Lock } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm rounded-lg bg-gray-800/60 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-green-500/10 p-3">
              <Wallet className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">TrackFi</h1>
          <p className="text-gray-400">
            Connectez-vous pour accéder à votre dashboard
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 px-5 py-2.5 text-center font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Vous n'avez pas de compte ?{" "}
          <Link href="/signup" className="font-medium text-green-400 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
