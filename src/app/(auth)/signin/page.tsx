"use client";

import Link from "next/link";
import { Wallet, Mail, Lock } from "lucide-react";
import { signIn, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("🔵 SignInPage component mounted");
    console.log("🔵 signIn function available:", typeof signIn);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("🟡 Form submitted!");
    
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("🟡 Form data:", { email, password });

    try {
      console.log("🟡 Calling signIn...");
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("🟡 signIn result:", result);

      if (result?.error) {
        console.log("🔴 Error:", result.error);
        setError("Email ou mot de passe incorrect.");
      } else if (result?.ok) {
        console.log("🟢 Success! Redirecting...");
        router.push("/dashboard");
      }
    } catch (e) {
      console.log("🔴 Exception:", e);
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

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

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/20 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}
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
                name="email"
                type="email"
                id="email"
                placeholder="you@example.com"
                required
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
                name="password"
                type="password"
                id="password"
                placeholder="••••••••"
                required
                className="block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-5 py-2.5 text-center font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
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

export default function SignInPage() {
  return (
    <SessionProvider>
      <SignInForm />
    </SessionProvider>
  );
}
