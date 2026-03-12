export function GlobeStatusBar({
  markerCount,
  generatedAt,
  dataMode,
  provider,
}: {
  markerCount: number
  generatedAt: string
  dataMode: string
  provider: string
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/65 px-5 py-4 text-sm text-slate-300 shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 px-3 py-1">
          {markerCount} markers
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          {dataMode.toUpperCase()} mode
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          {provider.toUpperCase()} provider
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          Updated {new Date(generatedAt).toLocaleString()}
        </span>
      </div>
    </div>
  )
}
