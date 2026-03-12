import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { FeatureCards } from '~/components/home/FeatureCards'
import { Hero } from '~/components/home/Hero'
import { MetricStrip } from '~/components/home/MetricStrip'
import { createServerApiClient } from '~/lib/orpc/client'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'BOM Access Layer | Curated weather API + globe',
      },
    ],
  }),
  loader: () => getHomePageData(),
  component: Home,
})

const getHomePageData = createServerFn({ method: 'GET' }).handler(async () => {
  const apiClient = createServerApiClient()
  const [overview, sources, health] = await Promise.all([
    apiClient.overview.australia(),
    apiClient.sources.list(),
    apiClient.health.status(),
  ])

  return {
    overview,
    sources,
    health,
  }
})

function Home() {
  const data = Route.useLoaderData()
  const hottestMarker = [...data.overview.markers].sort(
    (left, right) =>
      right.observation.airTemperatureC - left.observation.airTemperatureC,
  )[0]
  const averageTemperature =
    data.overview.markers.reduce((total, marker) => {
      return total + marker.observation.airTemperatureC
    }, 0) / Math.max(data.overview.markers.length, 1)

  const metrics = [
    {
      label: 'Average temperature',
      value: `${averageTemperature.toFixed(1)}°C`,
      accent: 'text-cyan-200',
    },
    {
      label: 'Warmest point',
      value: hottestMarker
        ? `${hottestMarker.name} ${hottestMarker.observation.airTemperatureC.toFixed(1)}°`
        : 'n/a',
      accent: 'text-amber-200',
    },
    {
      label: 'Forecast coverage',
      value: `${data.overview.markers.length}/${data.overview.markers.length}`,
      accent: 'text-emerald-200',
    },
    {
      label: 'API health',
      value: data.health.status.toUpperCase(),
      accent:
        data.health.status === 'ok' ? 'text-emerald-200' : 'text-yellow-200',
    },
  ]

  return (
    <div className="pb-20">
      <Hero
        markerCount={data.overview.markers.length}
        dataMode={data.overview.dataMode.toUpperCase()}
        provider={data.overview.provider.toUpperCase()}
      />
      <MetricStrip metrics={metrics} />
      <FeatureCards />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Globe-ready overview
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Eight curated weather points across Australia
              </h2>
            </div>
            <a
              href="/globe"
              className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100"
            >
              Open globe
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {data.overview.markers.map((marker) => (
              <article
                key={marker.id}
                className="rounded-2xl border border-white/8 bg-slate-950/55 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {marker.name}
                    </h3>
                    <p className="text-sm text-slate-400">{marker.state}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-cyan-100">
                      {marker.observation.airTemperatureC.toFixed(1)}°
                    </div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      current
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {marker.forecastSummary.precis}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full border border-white/8 px-3 py-1">
                    Max {marker.forecastSummary.maxTempC ?? '—'}°C
                  </span>
                  <span className="rounded-full border border-white/8 px-3 py-1">
                    Rain {marker.forecastSummary.precipitationProbabilityPct ?? '—'}%
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Source status
            </p>
            <div className="mt-5 space-y-3">
              {data.sources.items.map((source) => (
                <div
                  key={source.id}
                  className="rounded-2xl border border-white/8 bg-slate-950/50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">{source.label}</h3>
                    <span className="rounded-full border border-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                      {source.status} • {source.activeProvider}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {source.description}
                  </p>
                  {source.note ? (
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {source.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-amber-300/15 bg-amber-300/8 p-6 text-sm leading-7 text-amber-50 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-100/80">
              Attribution and usage
            </p>
            <p className="mt-3">{data.overview.attribution.notice}</p>
            <p className="mt-3 text-amber-50/80">
              {data.overview.attribution.usage}
            </p>
            <a
              href={data.overview.attribution.moreInfoUrl}
              className="mt-4 inline-flex text-sm font-semibold text-white underline"
            >
              Review BOM copyright guidance
            </a>
          </section>
        </div>
      </section>
    </div>
  )
}
