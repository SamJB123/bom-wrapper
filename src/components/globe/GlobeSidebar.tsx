import type { GlobeMarkerView } from './useGlobeData'

export function GlobeSidebar({
  marker,
}: {
  marker: GlobeMarkerView | null
}) {
  if (!marker) {
    return (
      <aside className="rounded-[28px] border border-white/10 bg-slate-950/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          Marker details
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Select a marker on the globe to inspect the latest observation and the
          top daily forecast period.
        </p>
      </aside>
    )
  }

  return (
    <aside className="rounded-[28px] border border-white/10 bg-slate-950/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            Marker details
          </div>
          <h2 className="mt-2 text-2xl font-bold text-white">{marker.name}</h2>
          <p className="text-sm text-slate-400">{marker.state}</p>
        </div>
        <div
          className="mt-1 h-4 w-4 rounded-full"
          style={{ backgroundColor: marker.color }}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Current temperature
          </div>
          <div className="mt-2 text-3xl font-black text-cyan-100">
            {marker.observation.airTemperatureC.toFixed(1)}°
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Wind speed
          </div>
          <div className="mt-2 text-3xl font-black text-violet-100">
            {marker.observation.windSpeedKmh ?? 0}
            <span className="ml-1 text-base font-semibold text-slate-400">
              km/h
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Forecast précis
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          {marker.forecastSummary.precis}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="rounded-full border border-white/8 px-3 py-1">
            Min {marker.forecastSummary.minTempC ?? '—'}°C
          </span>
          <span className="rounded-full border border-white/8 px-3 py-1">
            Max {marker.forecastSummary.maxTempC ?? '—'}°C
          </span>
          <span className="rounded-full border border-white/8 px-3 py-1">
            Rain {marker.forecastSummary.precipitationProbabilityPct ?? '—'}%
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 bg-white/5 p-4 text-sm leading-7 text-slate-300">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Source trace
        </div>
        <div className="mt-3 space-y-2">
          <p>
            Provider <strong>{marker.observation.source.provider}</strong>
          </p>
          <p>
            Observation product <strong>{marker.station.observationProductId}</strong>
          </p>
          <p>
            Forecast product <strong>{marker.location.forecastProductId}</strong>
          </p>
          <p>
            WMO <strong>{marker.station.wmoId}</strong>
          </p>
        </div>
      </div>
    </aside>
  )
}
