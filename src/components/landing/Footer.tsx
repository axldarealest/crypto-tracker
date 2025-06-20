"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-4 col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-green-400" />
                    <span className="text-xl font-bold text-white">TrackFi</span>
                </Link>
                <p className="text-sm text-gray-400">Votre partenaire de confiance pour la gestion et le suivi financiers.</p>
            </div>
            <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Fonctionnalités</h3>
                <ul role="list" className="mt-4 space-y-2">
                    <li><Link href="#features" className="text-sm text-gray-400 hover:text-white">Suivi Dépenses</Link></li>
                    <li><Link href="#features" className="text-sm text-gray-400 hover:text-white">Gestion Budget</Link></li>
                    <li><Link href="#features" className="text-sm text-gray-400 hover:text-white">Suivi Investissements</Link></li>
                    <li><Link href="#features" className="text-sm text-gray-400 hover:text-white">Analyses Visuelles</Link></li>
                </ul>
            </div>
             <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Compagnie</h3>
                <ul role="list" className="mt-4 space-y-2">
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">À propos</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Contact</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Politique de confidentialité</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Conditions de service</a></li>
                </ul>
            </div>
             <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Connecter</h3>
                <ul role="list" className="mt-4 space-y-2">
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Twitter</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">LinkedIn</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Facebook</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Instagram</a></li>
                </ul>
            </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-8 text-center">
            <p className="text-xs leading-5 text-gray-400">&copy; 2024 TrackFi. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
