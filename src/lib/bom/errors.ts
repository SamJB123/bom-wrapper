export type BomErrorCode =
  | 'NOT_FOUND'
  | 'UPSTREAM_UNAVAILABLE'
  | 'UNSUPPORTED_LIVE_SOURCE'
  | 'PARSE_ERROR'

export class BomDataError extends Error {
  constructor(
    message: string,
    readonly code: BomErrorCode,
    readonly causeValue?: unknown,
  ) {
    super(message)
    this.name = 'BomDataError'
  }
}

export function isBomDataError(error: unknown): error is BomDataError {
  return error instanceof BomDataError
}

export function notFound(message: string) {
  return new BomDataError(message, 'NOT_FOUND')
}

export function upstreamUnavailable(message: string, causeValue?: unknown) {
  return new BomDataError(message, 'UPSTREAM_UNAVAILABLE', causeValue)
}

export function unsupportedLiveSource(message: string) {
  return new BomDataError(message, 'UNSUPPORTED_LIVE_SOURCE')
}

export function parseFailure(message: string, causeValue?: unknown) {
  return new BomDataError(message, 'PARSE_ERROR', causeValue)
}
