"use client";

const testimonials = [
    {
      name: "Alexandre Dubois",
      role: "Investisseur Crypto",
      body: "YouFi a complètement transformé la façon dont je gère mes finances. L'interface intuitive et les fonctionnalités complètes en font un plaisir à utiliser.",
    },
    {
        name: "Michael Chen",
        role: "Entrepreneur Tech",
        body: "La fonction de suivi des investissements est fantastique ! Je peux surveiller mes actions et mes cryptos en un seul endroit. Hautement recommandé !",
    },
    {
        name: "Emily Rodriguez",
        role: "Propriétaire de Petite Entreprise",
        body: "Le suivi budgétaire n'a jamais été aussi simple. Les analyses visuelles m'aident à comprendre mes habitudes de dépenses.",
    },
  ]
  
  export default function Testimonials() {
    return (
      <section id="testimonials" className="relative isolate overflow-hidden bg-[var(--background)] py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-[var(--accent)]">
              Avis de nos utilisateurs
            </h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
                Ils nous font confiance. Pourquoi pas vous ?
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <figure key={index} className="flex flex-col border border-dashed border-[var(--foreground)]/20 p-6 sm:p-8">
                <blockquote className="flex-auto text-base leading-8 text-gray-600 sm:text-lg">
                  <p>"{testimonial.body}"</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4 border-t border-dashed border-[var(--foreground)]/20 pt-6">
                  <div>
                    <div className="font-semibold text-[var(--foreground)]">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    )
  }
