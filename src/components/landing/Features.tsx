"use client";

import { BarChart2, Briefcase, DollarSign, Wallet } from "lucide-react";

const features = [
  {
    name: "Suivi des Dépenses",
    description: "Suivez facilement vos dépenses et revenus quotidiens pour une vision claire de vos finances.",
    icon: Wallet,
  },
  {
    name: "Gestion de Budget",
    description: "Définissez et surveillez des budgets pour différentes catégories, et ne dépassez plus jamais vos limites.",
    icon: Briefcase,
  },
  {
    name: "Suivi des Investissements",
    description: "Surveillez vos actions et cryptomonnaies en temps réel, le tout en un seul endroit.",
    icon: DollarSign,
  },
  {
    name: "Analyses Visuelles",
    description: "Comprenez vos finances avec de beaux graphiques clairs et des rapports personnalisés.",
    icon: BarChart2,
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[var(--background)] py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[var(--accent)]">
            Fonctionnalités Clés
          </h2>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
            Tout ce dont vous avez besoin pour maîtriser vos finances
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-8 border-t border-dashed border-[var(--foreground)]/20 pt-8 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-12 lg:pt-12">
            {features.map((feature) => (
              <div key={feature.name} className="relative flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-[var(--foreground)]">
                  <feature.icon
                    className="h-5 w-5 flex-none text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-3 flex flex-auto flex-col text-base leading-7 text-gray-600 sm:mt-4">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
