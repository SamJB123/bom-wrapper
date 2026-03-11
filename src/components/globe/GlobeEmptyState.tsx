export function GlobeEmptyState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/65 p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
      <div className="text-lg font-semibold text-white">
        No weather markers available
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        The overview endpoint returned no markers, so the globe cannot render
        any weather points yet.
      </p>
    </div>
  )
}
