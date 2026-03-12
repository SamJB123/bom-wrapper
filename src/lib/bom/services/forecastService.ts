import { getBomDataMode } from '../mode'
import {
  getBomLiveProviderPreference,
  getOrderedLiveProviders,
} from '../providers'
import { notFound } from '../errors'
import { parseForecastPeriods } from '../parsers/forecastParser'
import {
  loadRawForecastPayload,
  loadRawForecastPayloadForProvider,
} from '../sources/forecastSource'
import { getDynamicForecastLocation } from '../sources/liveLocationSource'
import { getLiveForecastForLocation } from '../sources/liveForecastSource'
import { listPointPlaceMetadata } from '../sources/pointPlaceSource'
import { forecastResponseSchema } from '../types'
import { isDynamicWeatherApiLocationId } from '../liveMappings'

export async function listForecastLocations() {
  return listPointPlaceMetadata()
}

export async function getForecastLocation(locationId: string) {
  if (isDynamicWeatherApiLocationId(locationId)) {
    const dynamicLocation = await getDynamicForecastLocation(locationId)

    if (!dynamicLocation) {
      throw notFound(`Unknown live forecast location: ${locationId}`)
    }

    return dynamicLocation
  }

  const locations = await listPointPlaceMetadata()
  const location = locations.find((item) => item.id === locationId)

  if (!location) {
    throw notFound(`Unknown forecast location: ${locationId}`)
  }

  return location
}

export async function getForecast(locationId: string) {
  const location = await getForecastLocation(locationId)
  const mode = getBomDataMode()

  if (mode === 'fixture') {
    const rawPayload = await loadRawForecastPayload(location)
    const periods = parseForecastPeriods(rawPayload, location)

    return forecastResponseSchema.parse({
      location,
      periods,
    })
  }

  const liveProviderPreference = getBomLiveProviderPreference()
  let lastError: unknown = null

  for (const provider of getOrderedLiveProviders()) {
    try {
      if (provider === 'weather-api') {
        const liveForecast = await getLiveForecastForLocation(locationId)

        if (liveForecast) {
          return forecastResponseSchema.parse(liveForecast)
        }
      }

      if (provider === 'fwo-json') {
        const rawPayload = await loadRawForecastPayloadForProvider(
          location,
          'fwo-json',
        )
        const periods = parseForecastPeriods(rawPayload, location, {
          provider: 'fwo-json',
          status: 'ok',
          channel: 'http',
          note: 'Live forecast parsed from the BOM city forecast XML package.',
        })

        return forecastResponseSchema.parse({
          location,
          periods,
        })
      }
    } catch (error) {
      lastError = error

      if (liveProviderPreference !== 'auto') {
        throw error
      }
    }
  }

  if (lastError) {
    throw lastError
  }

  throw notFound(`No forecast provider could resolve location ${locationId}`)
}
