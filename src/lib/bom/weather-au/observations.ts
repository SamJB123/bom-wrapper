import { OBSERVATION_XML_PRODUCT_URLS } from './config'
import { fetchWeatherAuText } from './http'
import { listObservationStations, parseObservationXmlDocument } from './parsers/observationXml'
import type { ObservationStationAttributes, WeatherAuFetcher, WeatherAuState } from './types'

type ObservationsCreateOptions = {
  state: WeatherAuState
  fetcher?: WeatherAuFetcher
  xml?: string
}

export class Observations {
  static async create(options: ObservationsCreateOptions) {
    const url = OBSERVATION_XML_PRODUCT_URLS[options.state]
    const xml =
      options.xml ??
      (await fetchWeatherAuText(url, {
        fetcher: options.fetcher,
      }))

    return new Observations(options.state, url, xml, options.fetcher)
  }

  readonly acknowledgment: string
  readonly identifier: string
  readonly url: string

  private readonly document: Document

  private constructor(
    readonly state: WeatherAuState,
    url: string,
    readonly xml: string,
    readonly fetcher?: WeatherAuFetcher,
  ) {
    const parsed = parseObservationXmlDocument(xml)

    this.document = parsed.document
    this.identifier = parsed.identifier
    this.url = url
    this.acknowledgment = `Data courtesy of Bureau of Meteorology (${url})`
  }

  stations() {
    return listObservationStations(this.xml).stations
  }

  stationElements(wmoId?: string) {
    if (!wmoId) {
      return null
    }

    return this.document.querySelector(`station[wmo-id="${wmoId}"]`)
  }

  stationAttribute(wmoId?: string, attribute?: string) {
    const station = this.stationElements(wmoId)

    if (!station || !attribute) {
      return null
    }

    return station.getAttribute(attribute)
  }

  periodAttribute(wmoId?: string, attribute?: string) {
    const period = this.stationElements(wmoId)?.querySelector('period')

    if (!period || !attribute) {
      return null
    }

    return period.getAttribute(attribute)
  }

  airTemperature(wmoId?: string) {
    return this.readStationElementValue(wmoId, 'air_temperature')
  }

  rainfall(wmoId?: string) {
    return this.readStationElementValue(wmoId, 'rainfall')
  }

  private readStationElementValue(wmoId: string | undefined, type: string) {
    const station = this.stationElements(wmoId)

    if (!station) {
      return null
    }

    const element = station.querySelector(`element[type="${type}"]`)

    return element?.textContent?.trim() ?? null
  }

  toString() {
    return this.xml
  }
}

export type { ObservationStationAttributes }
