import type { GlobeMetric } from './colorScales'

const metricOptions: Array<{
  value: GlobeMetric
  label: string
  description: string
}> = [
  {
    value: 'temperature',
    label: 'Temperature',
    description: 'Marker colour and size reflect current air temperature.',
  },
  {
    value: 'wind',
    label: 'Wind',
    description: 'Marker colour and size reflect current wind speed.',
  },
  {
    value: 'rain',
    label: 'Rain',
    description: 'Marker colour and size reflect forecast precipitation probability.',
  },
]

export function GlobeLegend({
  metric,
  onMetricChange,
}: {
  metric: GlobeMetric
  onMetricChange: (metric: GlobeMetric) => void
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
        Metric overlay
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {metricOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onMetricChange(option.value)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              metric === option.value
                ? 'border-cyan-300/40 bg-cyan-300/12 text-white'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">
        {metricOptions.find((option) => option.value === metric)?.description}
      </p>
    </section>
  )
}
