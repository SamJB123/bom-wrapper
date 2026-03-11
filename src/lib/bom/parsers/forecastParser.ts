import { XMLParser } from 'fast-xml-parser'
import { z } from 'zod'
import { notFound, parseFailure } from '../errors'
import type { ForecastLocation } from '../types'
import { forecastPeriodSchema } from '../types'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: '#text',
  trimValues: true,
})

const textNodeSchema = z.object({
  type: z.string(),
  '#text': z.string(),
})

const elementNodeSchema = z.object({
  type: z.string(),
  '#text': z.union([z.string(), z.number()]).transform((value) => String(value)),
})

const forecastPeriodNodeSchema = z.object({
  'start-time-local': z.string(),
  'end-time-local': z.string(),
  text: z
    .union([textNodeSchema, z.array(textNodeSchema)])
    .transform((value) => (Array.isArray(value) ? value : [value])),
  element: z
    .union([elementNodeSchema, z.array(elementNodeSchema)])
    .transform((value) => (Array.isArray(value) ? value : [value])),
})

const areaNodeSchema = z.object({
  aac: z.string(),
  description: z.string(),
  'forecast-period': z
    .union([forecastPeriodNodeSchema, z.array(forecastPeriodNodeSchema)])
    .transform((value) => (Array.isArray(value) ? value : [value])),
})

const forecastDocumentSchema = z.object({
  product: z.object({
    amoc: z.object({
      source: z.object({
        sender: z.string(),
        'issue-time-utc': z.string(),
      }),
    }),
    forecast: z.object({
      area: z
        .union([areaNodeSchema, z.array(areaNodeSchema)])
        .transform((value) => (Array.isArray(value) ? value : [value])),
    }),
  }),
})

function parseNumber(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const numberValue = Number.parseFloat(value.replace('%', '').trim())

  return Number.isNaN(numberValue) ? null : numberValue
}

function extractTextValue(
  texts: Array<{ type: string; '#text': string }>,
  type: string,
) {
  return texts.find((text) => text.type === type)?.['#text'] ?? null
}

function extractElementValue(
  elements: Array<{ type: string; '#text': string }>,
  type: string,
) {
  return elements.find((element) => element.type === type)?.['#text'] ?? null
}

function toIsoDate(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    throw parseFailure(`Unexpected forecast timestamp: ${value}`)
  }

  return parsedDate.toISOString()
}

function toDateOnly(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    throw parseFailure(`Unexpected forecast period timestamp: ${value}`)
  }

  return parsedDate.toISOString().slice(0, 10)
}

export function parseForecastPeriods(rawForecast: string, location: ForecastLocation) {
  const rawDocument = xmlParser.parse(rawForecast)
  const parsedDocument = forecastDocumentSchema.safeParse(rawDocument)

  if (!parsedDocument.success) {
    throw parseFailure('Forecast XML did not match the expected BOM-like shape')
  }

  const matchingArea = parsedDocument.data.product.forecast.area.find((area) => {
    return area.aac.toLowerCase() === location.id.toLowerCase()
  })

  if (!matchingArea) {
    throw notFound(`Forecast XML did not contain location ${location.name}`)
  }

  const issueTimeUtc = parsedDocument.data.product.amoc.source['issue-time-utc']

  return matchingArea['forecast-period'].map((period) => {
    const minTemp = extractElementValue(
      period.element,
      'air_temperature_minimum',
    )
    const maxTemp = extractElementValue(
      period.element,
      'air_temperature_maximum',
    )

    return forecastPeriodSchema.parse({
      locationId: location.id,
      date: toDateOnly(period['start-time-local']),
      startTimeLocal: toIsoDate(period['start-time-local']),
      endTimeLocal: toIsoDate(period['end-time-local']),
      precis: extractTextValue(period.text, 'precis') ?? 'Forecast unavailable.',
      detailedText: extractTextValue(period.text, 'forecast'),
      minTempC: parseNumber(minTemp),
      maxTempC: parseNumber(maxTemp),
      precipitationProbabilityPct: parseNumber(
        extractElementValue(period.element, 'probability_of_precipitation'),
      ),
      precipitationRange: extractElementValue(
        period.element,
        'precipitation_range',
      ),
      source: {
        dataset: 'BOM city forecast XML',
        channel: 'fixture',
        status: 'fixture',
        productId: location.forecastProductId,
        fetchedAt: new Date().toISOString(),
        issuedAt: new Date(issueTimeUtc).toISOString(),
        note: 'Fixture-backed forecast parsed from a BOM-style XML package.',
      },
    })
  })
}
