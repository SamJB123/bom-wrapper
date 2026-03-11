export function GlobeUnsupportedState({ message }: { message: string }) {
  return (
    <div className="rounded-[28px] border border-amber-300/20 bg-amber-300/8 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
      <div className="text-lg font-semibold text-white">
        WebGPU is unavailable
      </div>
      <p className="mt-3 text-sm leading-7 text-amber-50/90">{message}</p>
      <p className="mt-3 text-sm leading-7 text-amber-50/80">
        The rest of the platform remains functional, including the generated
        OpenAPI docs and the normalized weather endpoints.
      </p>
    </div>
  )
}
