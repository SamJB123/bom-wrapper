import { DOMParser } from 'linkedom'
import { WeatherAuParseError, WeatherAuPlaceError } from '../errors'
import type { PlaceForecast } from '../types'

function parseHtml(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html')

  if (!document.querySelector('html')) {
    throw new WeatherAuParseError('Unable to parse place HTML document')
  }

  return document
}

export function parsePlaceHtmlDocument(html: string) {
  return parseHtml(html)
}

export function parsePlaceAirTemperature(html: string) {
  const document = parseHtml(html)
  const summaryNode = document.querySelector('#summary-1')

  if (!summaryNode) {
    throw new WeatherAuPlaceError(
      'Could not parse BOM place HTML (missing #summary-1)',
    )
  }

  const temperatureNode = summaryNode.querySelector('li.airT')

  if (!temperatureNode) {
    throw new WeatherAuPlaceError(
      'Could not parse BOM place HTML (missing li.airT)',
    )
  }

  const temperatureText = temperatureNode.textContent?.trim() ?? ''
  const parsedValue = Number.parseFloat(temperatureText.replace('°C', '').trim())

  return Number.isNaN(parsedValue) ? null : parsedValue
}

export function parsePlaceStationId(html: string) {
  const document = parseHtml(html)
  const stationIdNode = document.querySelector('p.station-id')

  if (!stationIdNode) {
    throw new WeatherAuPlaceError(
      'Could not parse BOM place HTML (missing p.station-id)',
    )
  }

  const value = stationIdNode.textContent?.trim() ?? ''

  return value.startsWith('ID: ') ? value.slice(4) : null
}

export function parsePlaceForecast(html: string): PlaceForecast {
  const document = parseHtml(html)
  const forecastsTop = document.querySelector('div.forecasts-top')

  if (!forecastsTop) {
    throw new WeatherAuPlaceError(
      'Could not parse BOM place HTML (missing div.forecasts-top)',
    )
  }

  const issuedText = forecastsTop.querySelector('span')?.textContent?.trim() ?? ''

  if (!issuedText.startsWith('issued at ')) {
    throw new WeatherAuPlaceError(
      'Could not parse BOM place HTML (missing issued text)',
    )
  }

  const summaryNode = document.querySelector('dl.forecast-summary')

  if (!summaryNode) {
    throw new WeatherAuPlaceError(
      'Could not parse BOM place HTML (missing dl.forecast-summary)',
    )
  }

  const date = summaryNode.querySelector('dt.date a')?.textContent?.trim()
  const min = summaryNode.querySelector('dd.min')?.textContent?.trim().replace('°C', '').trim()
  const max = summaryNode.querySelector('dd.max')?.textContent?.trim().replace('°C', '').trim()
  const precis = summaryNode.querySelector('dd.summary')?.textContent?.trim()

  return {
    issued: issuedText.slice(9).replace(/\.$/, '').trim(),
    date: date || undefined,
    min: min || undefined,
    max: max || undefined,
    precis: precis || undefined,
  }
}
