import { Link } from '@tanstack/react-router'

export function Hero({
  markerCount,
  dataMode,
}: {
  markerCount: number
  dataMode: string
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:px-8 lg:py-24">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
            External OpenAPI + immersive WebGPU frontend
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Bureau of Meteorology data, reshaped into an elegant developer and
              visualisation platform.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Explore a typed, external-facing oRPC OpenAPI API backed by
              BOM-style observation and forecast feeds, then move straight into
              a cinematic Australia-focused globe for visual inspection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/globe"
              className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Launch the globe
            </Link>
            <a
              href="/api/docs"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/40 hover:bg-white/10"
            >
              Browse API docs
            </a>
            <a
              href="/api/openapi.json"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:text-white"
            >
              Download OpenAPI JSON
            </a>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Snapshot
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                <div className="text-sm text-cyan-100/75">Curated weather points</div>
                <div className="mt-2 text-3xl font-black text-white">
                  {markerCount}
                </div>
              </div>
              <div className="rounded-2xl border border-indigo-300/20 bg-indigo-300/10 p-4">
                <div className="text-sm text-indigo-100/75">Runtime mode</div>
                <div className="mt-2 text-3xl font-black text-white">
                  {dataMode}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
              This build defaults to <strong className="text-white">fixture mode</strong>{' '}
              so the API and globe stay fully testable even when live BOM access
              is blocked from automated environments.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
