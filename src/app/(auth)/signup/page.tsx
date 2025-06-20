"use client";

import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-4 text-[var(--foreground)]">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Compte créé !</h1>
          <p className="text-gray-600 mb-6">
            Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-4 text-[var(--foreground)]">
      <div className="w-full max-w-md">
      <div className="mb-8 text-center">
            <Link href="/" className="mb-4 inline-block">
                <h1 className="text-4xl font-bold">YouFi</h1>
            </Link>
          <p className="text-gray-600">
            Créez un compte pour commencer à suivre vos finances.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-[var(--foreground)]/20 bg-white/20 p-8 shadow-sm backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Prénom"
                  required
                  className="block w-full rounded-md border-gray-300 bg-transparent p-3 pl-10 placeholder-gray-400 transition-colors focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                />
              </div>
              
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Nom"
                  required
                  className="block w-full rounded-md border-gray-300 bg-transparent p-3 pl-10 placeholder-gray-400 transition-colors focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                className="block w-full rounded-md border-gray-300 bg-transparent p-3 pl-10 placeholder-gray-400 transition-colors focus:border-[var(--accent)] focus:ring-[var(--accent)]"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mot de passe"
                required
                minLength={8}
                className="block w-full rounded-md border-gray-300 bg-transparent p-3 pl-10 placeholder-gray-400 transition-colors focus:border-[var(--accent)] focus:ring-[var(--accent)]"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                required
                minLength={8}
                className="block w-full rounded-md border-gray-300 bg-transparent p-3 pl-10 placeholder-gray-400 transition-colors focus:border-[var(--accent)] focus:ring-[var(--accent)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--accent)] px-5 py-3 text-center font-semibold text-white transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50"
            >
              {loading ? "Création du compte..." : "Créer le compte"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link href="/signin" className="font-semibold text-[var(--accent)] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
