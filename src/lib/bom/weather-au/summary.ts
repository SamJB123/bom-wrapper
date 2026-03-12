import { WeatherApi } from './api'
import type { SummaryItem, SummaryResult, WeatherAuFetcher } from './types'

type SummaryCreateOptions = {
  geohash?: string
  search?: string
  debug?: number
  fetcher?: WeatherAuFetcher
}

function createItem(
  label: string,
  value: string | number | null | undefined,
  unit: string,
): SummaryItem {
  return {
    label,
    value: value ?? null,
    unit,
  }
}

export class Summary {
  static async create(options?: SummaryCreateOptions) {
    const summary = new Summary(options)
    await summary.refresh()

    return summary
  }

  readonly api: WeatherApi

  locationData = null as Awaited<ReturnType<WeatherApi['location']>>
  warnings = null as Awaited<ReturnType<WeatherApi['warnings']>>
  observations = null as Awaited<ReturnType<WeatherApi['observations']>>
  forecastRain = null as Awaited<ReturnType<WeatherApi['forecastRain']>>
  forecastsDaily = null as Awaited<ReturnType<WeatherApi['forecastsDaily']>>
  forecastsHourly = null as Awaited<ReturnType<WeatherApi['forecastsHourly']>>
  private readonly searchTerm?: string

  private constructor(options?: SummaryCreateOptions) {
    this.searchTerm = options?.search
    this.api = new WeatherApi({
      geohash: options?.geohash,
      debug: options?.debug,
      fetcher: options?.fetcher,
    })
  }

  async refresh() {
    if (this.api.geohash === null && this.searchTerm) {
      await this.api.search(this.searchTerm)
    }

    if (this.api.geohash === null) {
      return
    }

    const [
      locationData,
      warnings,
      observations,
      forecastRain,
      forecastsDaily,
      forecastsHourly,
    ] = await Promise.all([
      this.api.location(),
      this.api.warnings(),
      this.api.observations(),
      this.api.forecastRain(),
      this.api.forecastsDaily(),
      this.api.forecastsHourly(),
    ])

    this.locationData = locationData
    this.warnings = warnings
    this.observations = observations
    this.forecastRain = forecastRain
    this.forecastsDaily = forecastsDaily
    this.forecastsHourly = forecastsHourly
  }

  summary(): SummaryResult | null {
    if (
      this.locationData === null ||
      this.observations === null ||
      this.forecastsDaily === null ||
      this.forecastsDaily.length < 1
    ) {
      return null
    }

    const currentForecast = this.forecastsDaily[0]
    const rainAmount = currentForecast.rain?.amount

    const result: SummaryResult = {
      location: createItem(
        'Location',
        `${this.locationData.name}, ${this.locationData.state}`,
        '',
      ),
      current_temp: createItem(
        'Current Temp',
        this.observations.temp ?? null,
        '°',
      ),
      precis: createItem('Precis', currentForecast.short_text ?? null, ''),
      temp_now: createItem(
        currentForecast.now?.now_label ?? 'Now',
        currentForecast.now?.temp_now ?? null,
        '°',
      ),
      temp_later: createItem(
        currentForecast.now?.later_label ?? 'Later',
        currentForecast.now?.temp_later ?? null,
        '°',
      ),
      temp_feels_like: createItem(
        'Feels Like',
        this.observations.temp_feels_like ?? null,
        '°',
      ),
      chance_of_rain: createItem(
        'Chance of any Rain',
        currentForecast.rain?.chance ?? null,
        '%',
      ),
    }

    if (
      rainAmount &&
      rainAmount.max !== null &&
      typeof rainAmount.max === 'number' &&
      rainAmount.max > 0
    ) {
      result.possible_rainfall = createItem(
        'Possible Rainfall',
        `${rainAmount.min ?? 0}-${rainAmount.max}`,
        rainAmount.units,
      )
    }

    return result
  }

  summaryText() {
    const summary = this.summary()

    if (summary === null) {
      return this.api.acknowledgment
    }

    const text = Object.values(summary)
      .map((item) => `${item.label.padEnd(20, ' ')}${item.value ?? '--'}${item.unit}`)
      .join('\n')

    return `${text}\n\n${this.api.acknowledgment}`
  }

  today() {
    const currentForecast = this.forecastsDaily?.[0]

    if (!currentForecast) {
      return null
    }

    return {
      extended_text: currentForecast.extended_text,
    }
  }
}
