export class WeatherAuError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WeatherAuError'
  }
}

export type WeatherAuParseErrorDetails = {
  expectedShape?: unknown
  response?: unknown
  validationErrors?: unknown
}

export class WeatherAuHttpError extends WeatherAuError {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
    readonly body: string,
  ) {
    super(message)
    this.name = 'WeatherAuHttpError'
  }
}

export class WeatherAuParseError extends WeatherAuError {
  constructor(message: string, readonly details?: WeatherAuParseErrorDetails) {
    super(message)
    this.name = 'WeatherAuParseError'
  }
}

export class WeatherAuPlaceError extends WeatherAuError {
  constructor(message: string) {
    super(message)
    this.name = 'WeatherAuPlaceError'
  }
}

export function isWeatherAuParseError(
  error: unknown,
): error is WeatherAuParseError {
  return error instanceof WeatherAuParseError
}
