import type { GlobeMarkerView } from './useGlobeData'

export function GlobeTooltip({
  marker,
  pointer,
}: {
  marker: GlobeMarkerView | null
  pointer: { x: number; y: number } | null
}) {
  if (!marker || !pointer) {
    return null
  }

  return (
    <div
      className="pointer-events-none absolute z-20 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl backdrop-blur"
      style={{
        left: pointer.x + 16,
        top: pointer.y + 16,
      }}
    >
      <div className="text-sm font-semibold text-white">{marker.name}</div>
      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
        {marker.state}
      </div>
      <div className="mt-2 text-sm text-cyan-100">{marker.metricLabel}</div>
    </div>
  )
}
