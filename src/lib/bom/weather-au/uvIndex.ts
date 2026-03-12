import { UV_INDEX_PRODUCT_URLS } from './config'
import { fetchWeatherAuText } from './http'
import { getUvAlertMessage, listUvLocations, parseUvXmlDocument } from './parsers/uvXml'
import type { WeatherAuFetcher, WeatherAuState } from './types'

type UvIndexCreateOptions = {
  state: WeatherAuState
  fetcher?: WeatherAuFetcher
  xml?: string
}

export class UvIndex {
  static async create(options: UvIndexCreateOptions) {
    const url = UV_INDEX_PRODUCT_URLS[options.state]
    const xml =
      options.xml ??
      (await fetchWeatherAuText(url, {
        fetcher: options.fetcher,
      }))

    return new UvIndex(options.state, url, xml, options.fetcher)
  }

  readonly acknowledgment: string
  readonly identifier: string
  readonly url: string

  private constructor(
    readonly state: WeatherAuState,
    url: string,
    readonly xml: string,
    readonly fetcher?: WeatherAuFetcher,
  ) {
    const parsed = parseUvXmlDocument(xml)

    this.identifier = parsed.identifier
    this.url = url
    this.acknowledgment = `Data courtesy of Bureau of Meteorology (${url})`
  }

  aacList() {
    return Object.fromEntries(listUvLocations(this.xml).locations.entries())
  }

  getAac(description?: string) {
    if (!description) {
      return null
    }

    return listUvLocations(this.xml).locations.get(description) ?? null
  }

  uvMessage(aac?: string) {
    if (!aac) {
      return null
    }

    return getUvAlertMessage(this.xml, aac)
  }

  uvSolarNoonIndex() {
    return 'http://reg.bom.gov.au/fwo/IDY00508.gif'
  }

  toString() {
    return this.xml
  }
}
