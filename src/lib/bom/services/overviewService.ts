import { bomAttribution } from '../source-config'
import { getBomDataMode } from '../mode'
import { getForecastLocation, getForecast } from './forecastService'
import { getObservation, getStation, listStations } from './observationService'
import { australiaOverviewResponseSchema } from '../types'

export async function getAustraliaOverview() {
  const stationList = await listStations()

  const markers = await Promise.all(
    stationList.items.map(async (station) => {
      const [freshStation, location, observation, forecast] = await Promise.all([
        getStation(station.id),
        getForecastLocation(station.forecastLocationId),
        getObservation(station.id),
        getForecast(station.forecastLocationId),
      ])

      const todayForecast = forecast.periods[0]

      return {
        id: station.id,
        name: freshStation.name,
        state: freshStation.state,
        coordinates: freshStation.coordinates,
        station: freshStation,
        location,
        observation,
        forecastSummary: {
          precis: todayForecast?.precis ?? 'Forecast unavailable.',
          maxTempC: todayForecast?.maxTempC ?? null,
          minTempC: todayForecast?.minTempC ?? null,
          precipitationProbabilityPct:
            todayForecast?.precipitationProbabilityPct ?? null,
        },
      }
    }),
  )

  return australiaOverviewResponseSchema.parse({
    generatedAt: new Date().toISOString(),
    dataMode: getBomDataMode(),
    markers,
    attribution: bomAttribution,
  })
}
