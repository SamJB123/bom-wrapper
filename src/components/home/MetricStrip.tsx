type Metric = {
  label: string
  value: string
  accent: string
}

export function MetricStrip({ metrics }: { metrics: Array<Metric> }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-[28px] border border-white/10 bg-slate-950/45 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/8 bg-white/5 p-4"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {metric.label}
            </div>
            <div className={`mt-2 text-3xl font-black ${metric.accent}`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
