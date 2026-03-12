import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

function formatErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return null
  }

  const detailedError = error as Error & {
    details?: unknown
    cause?: unknown
    data?: unknown
  }

  const details =
    detailedError.details ??
    detailedError.data ??
    (typeof detailedError.cause === 'object' ? detailedError.cause : null)

  if (details === undefined || details === null) {
    return null
  }

  try {
    return JSON.stringify(details, null, 2)
  } catch {
    return String(details)
  }
}

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })
  const errorDetails = formatErrorDetails(error)

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      {errorDetails ? (
        <div className="w-full max-w-5xl rounded-2xl border border-rose-300/25 bg-slate-950/80 p-4 text-left shadow-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-200/80">
            Error diagnostics
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            The payload that failed validation and the expected shape are shown
            below to make upstream drift easier to investigate.
          </p>
          <pre className="mt-4 max-h-[28rem] overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-slate-200 whitespace-pre-wrap">
            {errorDetails}
          </pre>
        </div>
      ) : null}
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => {
            router.invalidate()
          }}
          className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
            onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  )
}
