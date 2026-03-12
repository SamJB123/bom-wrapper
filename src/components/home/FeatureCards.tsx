const featureCards = [
  {
    title: 'Typed access layer',
    description:
      'oRPC contracts define stable endpoints for stations, observations, daily forecasts, source health, and an Australia overview dataset.',
  },
  {
    title: 'weather-au, reimagined for Workers',
    description:
      'A TypeScript port of the weather-au module families now underpins live Weather API, XML, place, UV, and summary capabilities inside this Worker-native codebase.',
  },
  {
    title: 'OpenAPI by default',
    description:
      'The API ships with generated OpenAPI JSON and interactive documentation so downstream teams can integrate quickly.',
  },
  {
    title: 'Visual-first exploration',
    description:
      'A Three.js WebGPU globe turns weather feeds into an explorable spatial interface with marker inspection and forecast context.',
  },
]

export function FeatureCards() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[0_12px_48px_rgba(0,0,0,0.22)]"
          >
            <h2 className="text-xl font-semibold text-white">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
