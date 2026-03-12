import { WEATHER_AU_PLACE_USER_AGENT, buildPlaceUrl } from './config'
import { fetchWeatherAuText } from './http'
import {
  parsePlaceAirTemperature,
  parsePlaceForecast,
  parsePlaceHtmlDocument,
  parsePlaceStationId,
} from './parsers/placeHtml'
import type { PlaceForecast, WeatherAuFetcher } from './types'

type PlaceCreateOptions = {
  state: string
  location: string
  fetcher?: WeatherAuFetcher
  html?: string
}

export class Place {
  static async create(options: PlaceCreateOptions) {
    const url = buildPlaceUrl(options.state, options.location)
    const html =
      options.html ??
      (await fetchWeatherAuText(url, {
        fetcher: options.fetcher,
        init: {
          headers: {
            'User-Agent': WEATHER_AU_PLACE_USER_AGENT,
          },
        },
      }))

    return new Place(url, html, options.fetcher)
  }

  readonly acknowledgment: string
  readonly url: string

  private constructor(
    url: string,
    readonly html: string,
    readonly fetcher?: WeatherAuFetcher,
  ) {
    this.url = url
    this.acknowledgment = `Data courtesy of Bureau of Meteorology (${url})`
  }

  airTemperature() {
    return parsePlaceAirTemperature(this.html)
  }

  forecast(): PlaceForecast {
    return parsePlaceForecast(this.html)
  }

  stationId() {
    return parsePlaceStationId(this.html)
  }

  document() {
    return parsePlaceHtmlDocument(this.html)
  }
}
