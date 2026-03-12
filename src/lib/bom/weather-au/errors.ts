export class WeatherAuError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WeatherAuError'
  }
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
  constructor(message: string, readonly details?: unknown) {
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
