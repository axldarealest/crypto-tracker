"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center bg-[var(--background)] text-[var(--foreground)]">
      {/* Lignes de grille en fond */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full border-r border-dashed border-gray-700/10" />
      </div>

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:py-0">
        {/* Section Texte */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Gérez vos <span className="text-[var(--accent)]">cryptos</span> avec style
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground)]/70 sm:text-xl md:mt-6 max-w-2xl">
            YouFi est la plateforme la plus simple et la plus élégante pour gérer tous vos actifs numériques en un seul endroit.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 md:mt-10">
            <Link
              href="/signup"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 sm:w-auto"
            >
              Commencer
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="group text-sm font-semibold leading-6 text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
            >
              Aller au Dashboard 
              <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Section Visuel */}
        <div className="flex h-full min-h-[300px] items-center justify-center sm:min-h-[400px]">
          <div className="relative h-48 w-48 sm:h-64 sm:w-64">
            <div className="absolute inset-0 rounded-full bg-orange-200/50 blur-2xl" />
            <div className="absolute inset-8 rounded-full bg-orange-300/50 blur-2xl animation-delay-200" />
            <div className="absolute inset-16 rounded-full bg-orange-400/50 blur-2xl animation-delay-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
