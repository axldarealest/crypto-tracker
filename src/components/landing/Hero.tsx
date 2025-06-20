"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gray-900 overflow-hidden">
      {/* Fond avec flou */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[400px] w-[600px] rounded-full bg-green-500/10 blur-3xl filter" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Maîtrisez votre argent,
          <br />
          Façonnez votre avenir.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Votre solution tout-en-un pour le suivi des finances, des investissements et de la budgétisation.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Commencer
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold leading-6 text-white">
            Aller au Dashboard <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
