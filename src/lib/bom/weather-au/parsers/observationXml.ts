import { DOMParser } from 'linkedom'
import { WeatherAuParseError } from '../errors'
import type { ObservationStationAttributes } from '../types'

function parseXml(xml: string) {
  const document = new DOMParser().parseFromString(xml, 'text/xml')
  const parserError = document.querySelector('parsererror')

  if (parserError) {
    throw new WeatherAuParseError(
      `Unable to parse observation XML: ${parserError.textContent ?? 'unknown parser error'}`,
    )
  }

  return document
}

function elementAttributesToRecord(element: Element): ObservationStationAttributes {
  const attributes: ObservationStationAttributes = {}

  for (const attribute of Array.from(element.attributes)) {
    attributes[attribute.name] = attribute.value
  }

  return attributes
}

export function parseObservationXmlDocument(xml: string) {
  const document = parseXml(xml)
  const identifier = document.querySelector('identifier')?.textContent?.trim()

  if (!identifier) {
    throw new WeatherAuParseError('Observation XML is missing an identifier')
  }

  return {
    document,
    identifier,
  }
}

export function listObservationStations(xml: string) {
  const { document, identifier } = parseObservationXmlDocument(xml)
  const stations = Array.from(document.querySelectorAll('station')).map(
    (station) => elementAttributesToRecord(station as Element),
  )

  return {
    identifier,
    stations,
  }
}
