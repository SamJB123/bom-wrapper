import { forecastLocationSchema, locationSearchResultSchema } from '../types'
import type { WeatherApiLocation } from '../weather-au'
import { toDynamicWeatherApiLocationId } from '../liveMappings'

export function mapWeatherApiLocationToForecastLocation(
  location: WeatherApiLocation,
  options?: {
    locationId?: string
    stationId?: string
    forecastProductId?: string
  },
) {
  return forecastLocationSchema.parse({
    id: options?.locationId ?? toDynamicWeatherApiLocationId(location.geohash),
    name: location.name,
    state: location.state,
    timezone: location.timezone,
    coordinates: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    forecastProductId: options?.forecastProductId ?? 'weather-api',
    stationId: options?.stationId ?? toDynamicWeatherApiLocationId(location.geohash),
  })
}

export function mapWeatherApiLocationToLocationSearchResult(
  location: WeatherApiLocation,
) {
  return locationSearchResultSchema.parse({
    id: toDynamicWeatherApiLocationId(location.geohash),
    kind: 'forecast-location',
    name: location.name,
    state: location.state,
    subtitle: `${location.state} • live weather-api result`,
    coordinates: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    stationId: null,
    locationId: toDynamicWeatherApiLocationId(location.geohash),
  })
}
