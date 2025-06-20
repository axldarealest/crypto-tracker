"use client";

const testimonials = [
    {
      body: "TrackFi a complètement transformé la façon dont je gère mes finances. L'interface intuitive et les fonctionnalités complètes en font un plaisir à utiliser.",
      author: {
        name: "Sarah Johnson",
        role: "Analyste Financier",
      },
    },
    {
        body: "La fonction de suivi des investissements est fantastique ! Je peux surveiller mes actions et mes cryptos en un seul endroit. Hautement recommandé !",
        author: {
          name: "Michael Chen",
          role: "Entrepreneur Tech",
        },
    },
    {
        body: "Le suivi budgétaire n'a jamais été aussi simple. Les analyses visuelles m'aident à comprendre mes habitudes de dépenses.",
        author: {
          name: "Emily Rodriguez",
          role: "Propriétaire de Petite Entreprise",
        },
    },
  ]
  
  export default function Testimonials() {
    return (
      <section id="testimonials" className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ce que disent nos utilisateurs</h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.author.name} className="flex flex-col rounded-lg bg-gray-800/60 p-8">
                <blockquote className="flex-auto text-lg leading-8 text-gray-300">
                  <p>“{testimonial.body}”</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div>
                    <div className="font-semibold text-white">{testimonial.author.name}</div>
                    <div className="text-gray-400">{testimonial.author.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    )
  }
