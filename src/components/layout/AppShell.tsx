import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/globe', label: 'Globe' },
] as const

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(76,119,255,0.18),transparent_28%),linear-gradient(180deg,#07101d_0%,#040814_58%,#02050d_100%)] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-400/10 text-lg font-black text-cyan-200 shadow-[0_0_50px_rgba(34,211,238,0.16)]">
              AU
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
                BOM Access Layer
              </div>
              <div className="truncate text-lg font-semibold text-white">
                OpenAPI weather platform
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {primaryLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{
                  className:
                    'border-cyan-300/40 bg-cyan-300/15 text-white shadow-[0_0_30px_rgba(34,211,238,0.12)]',
                }}
                activeOptions={{ exact: link.to === '/' }}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-300/35 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/api/docs"
              className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:border-emerald-200/55 hover:bg-emerald-300/15"
            >
              API Docs
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            Built for exploration, prototyping, and visual storytelling around
            BOM-style weather data.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/api/openapi.json" className="hover:text-slate-200">
              OpenAPI JSON
            </a>
            <a
              href="https://www.bom.gov.au/other/copyright.shtml"
              className="hover:text-slate-200"
            >
              BOM attribution guidance
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
