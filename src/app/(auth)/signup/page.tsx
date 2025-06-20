"use client";

import Link from "next/link";
import { Wallet, Mail, Lock, User } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Redirect if already authenticated
  useAuthRedirect("/dashboard");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const name = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          password,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/signin?message=account-created');
      }, 2000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-lg bg-gray-800/60 p-6 shadow-xl backdrop-blur-sm text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-green-500/10 p-3">
              <Wallet className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Compte créé !</h1>
          <p className="text-gray-400 mb-4">
            Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800/60 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-green-500/10 p-3">
              <Wallet className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Créez votre compte</h1>
          <p className="text-gray-400">Pour commencer à suivre vos finances</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/20 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-300">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  className="block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-300">
                Nom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                  className="block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                className="block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={8}
                className="block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-300">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
                minLength={8}
                className="block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-5 py-2.5 text-center font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800 disabled:opacity-50"
          >
            {loading ? "Création du compte..." : "Créer le compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Vous avez déjà un compte ?{" "}
          <Link href="/signin" className="font-medium text-green-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
