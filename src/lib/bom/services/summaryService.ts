import { getBomDataMode } from '../mode'
import {
  getDynamicWeatherApiGeohash,
  getLiveMappingByLocationId,
} from '../liveMappings'
import { Summary } from '../weather-au'
import { getForecast, getForecastLocation } from './forecastService'
import { getObservation } from './observationService'
import { locationSummaryResponseSchema } from '../types'

export async function getLocationSummary(locationId: string) {
  const mode = getBomDataMode()
  const location = await getForecastLocation(locationId)

  if (mode === 'fixture') {
    const [observation, forecast] = await Promise.all([
      getObservation(location.stationId),
      getForecast(locationId),
    ])
    const firstPeriod = forecast.periods[0]

    return locationSummaryResponseSchema.parse({
      locationId,
      locationName: location.name,
      items: [
        {
          key: 'current_temp',
          label: 'Current Temp',
          value: observation.airTemperatureC,
          unit: '°',
        },
        {
          key: 'precis',
          label: 'Precis',
          value: firstPeriod?.precis ?? null,
          unit: '',
        },
        {
          key: 'chance_of_rain',
          label: 'Chance of any Rain',
          value: firstPeriod?.precipitationProbabilityPct ?? null,
          unit: '%',
        },
      ],
      source: {
        dataset: 'Normalized fixture summary',
        provider: 'fixture',
        channel: 'fixture',
        status: 'fixture',
        note: 'Summary derived from fixture-backed normalized observation and forecast services.',
        fetchedAt: new Date().toISOString(),
      },
    })
  }

  const mapping = getLiveMappingByLocationId(locationId)
  const geohash = mapping?.geohash ?? getDynamicWeatherApiGeohash(locationId)
  const summary = await Summary.create({
    geohash: geohash ?? undefined,
  })
  const result = summary.summary()

  return locationSummaryResponseSchema.parse({
    locationId,
    locationName: location.name,
    items:
      result === null
        ? []
        : Object.entries(result).map(([key, item]) => ({
            key,
            label: item.label,
            value: item.value,
            unit: item.unit,
          })),
    source: {
      dataset: 'BOM Weather API summary',
      provider: 'weather-api',
      channel: 'http',
      status: result === null ? 'degraded' : 'ok',
      note: 'Summary derived from the TypeScript weather-au port over the BOM Weather API.',
      fetchedAt: summary.api.responseTimestamp ?? new Date().toISOString(),
    },
  })
}
