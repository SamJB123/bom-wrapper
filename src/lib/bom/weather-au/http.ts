import { WeatherAuHttpError } from './errors'
import type { WeatherAuFetcher } from './types'

const defaultFetcher: WeatherAuFetcher = (input, init) => fetch(input, init)

export function getWeatherAuFetcher(fetcher?: WeatherAuFetcher) {
  return fetcher ?? defaultFetcher
}

export async function fetchWeatherAuText(
  url: string,
  options?: {
    fetcher?: WeatherAuFetcher
    init?: RequestInit
  },
) {
  const response = await getWeatherAuFetcher(options?.fetcher)(url, options?.init)
  const text = await response.text()

  if (!response.ok) {
    throw new WeatherAuHttpError(
      `Weather AU upstream request failed with ${response.status} for ${url}`,
      response.status,
      url,
      text,
    )
  }

  return text
}

export async function fetchWeatherAuJson<TData>(
  url: string,
  options?: {
    fetcher?: WeatherAuFetcher
    init?: RequestInit
  },
) {
  const text = await fetchWeatherAuText(url, options)

  return JSON.parse(text) as TData
}
