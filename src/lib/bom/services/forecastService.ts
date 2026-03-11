import { notFound } from '../errors'
import { parseForecastPeriods } from '../parsers/forecastParser'
import { loadRawForecastPayload } from '../sources/forecastSource'
import { listPointPlaceMetadata } from '../sources/pointPlaceSource'
import { forecastResponseSchema } from '../types'

export async function listForecastLocations() {
  return listPointPlaceMetadata()
}

export async function getForecastLocation(locationId: string) {
  const locations = await listPointPlaceMetadata()
  const location = locations.find((item) => item.id === locationId)

  if (!location) {
    throw notFound(`Unknown forecast location: ${locationId}`)
  }

  return location
}

export async function getForecast(locationId: string) {
  const location = await getForecastLocation(locationId)
  const rawPayload = await loadRawForecastPayload(location)
  const periods = parseForecastPeriods(rawPayload, location)

  return forecastResponseSchema.parse({
    location,
    periods,
  })
}
