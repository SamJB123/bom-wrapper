import {
  WEATHER_API_ACKNOWLEDGMENT,
  buildWeatherApiLocationEndpointUrl,
  buildWeatherApiLocationSearchUrl,
  buildWeatherApiLocationUrl,
  buildWeatherApiWarningUrl,
} from './config'
import { WeatherAuHttpError } from './errors'
import { fetchWeatherAuJson } from './http'
import {
  parseWeatherApiDailyForecastResponse,
  parseWeatherApiHourlyForecastResponse,
  parseWeatherApiLocationResponse,
  parseWeatherApiObservationResponse,
  parseWeatherApiRainForecastResponse,
  parseWeatherApiSearchResponse,
  parseWeatherApiWarningDetailResponse,
  parseWeatherApiWarningsResponse,
} from './parsers/weatherApi'
import type {
  WeatherApiDailyForecast,
  WeatherApiHourlyForecast,
  WeatherApiLocation,
  WeatherApiObservation,
  WeatherApiRainForecast,
  WeatherApiSearchResult,
  WeatherApiWarningDetail,
  WeatherApiWarningSummary,
  WeatherAuFetcher,
} from './types'

type WeatherApiCreateOptions = {
  geohash?: string
  search?: string
  debug?: number
  fetcher?: WeatherAuFetcher
}

const SEARCH_FALLBACK_STATE_CODES = [
  'ACT',
  'NSW',
  'NT',
  'QLD',
  'SA',
  'TAS',
  'VIC',
  'WA',
]

function formatGeohash(geohash: string | null | undefined) {
  if (!geohash) {
    return null
  }

  return geohash.slice(0, 6)
}

function normalizeSearchTerms(search: string) {
  const trimmedSearch = search.trim()

  if (trimmedSearch.length === 0) {
    return []
  }

  const replacedDashes =
    trimmedSearch.length > 1
      ? `${trimmedSearch[0]}${trimmedSearch.slice(1).replaceAll('-', '+')}`
      : trimmedSearch

  const compactSearch = replacedDashes.replaceAll('+', ' ')
  const tokens = compactSearch.split(/\s+/).filter(Boolean)
  const fallbacks = new Set<string>([replacedDashes, compactSearch])

  if (tokens.length > 1) {
    const withoutState = tokens.filter(
      (token) =>
        !SEARCH_FALLBACK_STATE_CODES.includes(token.toUpperCase()),
    )

    if (withoutState.length > 0) {
      fallbacks.add(withoutState.join(' '))
      fallbacks.add(withoutState[0] ?? compactSearch)
    }
  }

  return [...fallbacks]
}

export class WeatherApi {
  static async create(options?: WeatherApiCreateOptions) {
    const api = new WeatherApi(options)

    if (options?.search) {
      await api.search(options.search)
    }

    return api
  }

  private readonly debug: number
  private readonly fetcher?: WeatherAuFetcher
  private locationResult: WeatherApiSearchResult | null = null

  geohash: string | null
  responseTimestamp: string | null = null
  readonly acknowledgment = WEATHER_API_ACKNOWLEDGMENT

  constructor(options?: WeatherApiCreateOptions) {
    this.debug = options?.debug ?? 0
    this.fetcher = options?.fetcher
    this.geohash = formatGeohash(options?.geohash)
  }

  private log(...args: Array<unknown>) {
    if (this.debug > 0) {
      console.info('[weather-au]', ...args)
    }
  }

  private async request<TData>(
    url: string,
    parser: (value: unknown) => { metadata: { response_timestamp: string }; data: TData },
  ) {
    this.log('Fetching', url)
    const payload = await fetchWeatherAuJson<unknown>(url, {
      fetcher: this.fetcher,
    })
    const parsed = parser(payload)
    this.responseTimestamp = parsed.metadata.response_timestamp

    return parsed.data
  }

  async search(search = '', select = 0) {
    this.locationResult = null
    this.geohash = null

    if (search.trim() === '') {
      return []
    }

    for (const candidate of normalizeSearchTerms(search)) {
      const results = await this.request(
        buildWeatherApiLocationSearchUrl(candidate),
        parseWeatherApiSearchResponse,
      )

      if (results.length > select) {
        this.locationResult = results[select] ?? null
        this.geohash = formatGeohash(this.locationResult?.geohash)

        return results
      }
    }

    return []
  }

  async location() {
    if (!this.geohash) {
      return null
    }

    return this.request<WeatherApiLocation>(
      buildWeatherApiLocationUrl(this.geohash),
      parseWeatherApiLocationResponse,
    )
  }

  async warnings() {
    if (!this.geohash) {
      return null
    }

    return this.request<Array<WeatherApiWarningSummary>>(
      buildWeatherApiLocationEndpointUrl(this.geohash, 'warnings'),
      parseWeatherApiWarningsResponse,
    )
  }

  async warning(id?: string) {
    if (!id) {
      return null
    }

    return this.request<WeatherApiWarningDetail>(
      buildWeatherApiWarningUrl(id),
      parseWeatherApiWarningDetailResponse,
    )
  }

  async observations() {
    if (!this.geohash) {
      return null
    }

    return this.request<WeatherApiObservation>(
      buildWeatherApiLocationEndpointUrl(this.geohash, 'observations'),
      parseWeatherApiObservationResponse,
    )
  }

  async forecastRain() {
    if (!this.geohash) {
      return null
    }

    try {
      return await this.request<WeatherApiRainForecast>(
        buildWeatherApiLocationEndpointUrl(this.geohash, 'forecast/rain'),
        parseWeatherApiRainForecastResponse,
      )
    } catch (error) {
      if (error instanceof WeatherAuHttpError && error.status === 404) {
        return null
      }

      throw error
    }
  }

  async forecastsDaily() {
    if (!this.geohash) {
      return null
    }

    return this.request<Array<WeatherApiDailyForecast>>(
      buildWeatherApiLocationEndpointUrl(this.geohash, 'forecasts/daily'),
      parseWeatherApiDailyForecastResponse,
    )
  }

  async forecastsHourly() {
    if (!this.geohash) {
      return null
    }

    return this.request<Array<WeatherApiHourlyForecast>>(
      buildWeatherApiLocationEndpointUrl(this.geohash, 'forecasts/hourly'),
      parseWeatherApiHourlyForecastResponse,
    )
  }

  toString() {
    const geohash = this.geohash ? `'${this.geohash}'` : 'None'
    const search =
      this.locationResult === null
        ? ''
        : `${this.locationResult.name} ${this.locationResult.state}`

    return `WeatherApi(geohash=${geohash}, search='${search}', debug=${this.debug}), timestamp=${this.responseTimestamp}`
  }
}
