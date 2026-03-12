import { DOMParser } from 'linkedom'
import { WeatherAuParseError } from '../errors'

function parseXml(xml: string) {
  const document = new DOMParser().parseFromString(xml, 'text/xml')
  const parserError = document.querySelector('parsererror')

  if (parserError) {
    throw new WeatherAuParseError(
      `Unable to parse UV XML: ${parserError.textContent ?? 'unknown parser error'}`,
    )
  }

  return document
}

export function parseUvXmlDocument(xml: string) {
  const document = parseXml(xml)
  const identifier = document.querySelector('identifier')?.textContent?.trim()

  if (!identifier) {
    throw new WeatherAuParseError('UV XML is missing an identifier')
  }

  return {
    document,
    identifier,
  }
}

export function listUvLocations(xml: string) {
  const { document, identifier } = parseUvXmlDocument(xml)
  const locations = new Map<string, string>()

  for (const area of Array.from(
    document.querySelectorAll('area[type="location"]'),
  )) {
    const typedArea = area as Element
    const description = typedArea.getAttribute('description')
    const aac = typedArea.getAttribute('aac')

    if (description && aac) {
      locations.set(description, aac)
    }
  }

  return {
    identifier,
    locations,
  }
}

export function getUvAlertMessage(xml: string, aac: string) {
  const { document } = parseUvXmlDocument(xml)
  const area = document.querySelector(`area[type="location"][aac="${aac}"]`)

  if (!area) {
    return null
  }

  const alertText = area
    .querySelector('forecast-period[index="0"] text[type="uv_alert"]')
    ?.textContent?.trim()

  return alertText ?? null
}
