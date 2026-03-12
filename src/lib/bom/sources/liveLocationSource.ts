import { withCache } from '../cache'
import { toDynamicWeatherApiLocationId } from '../liveMappings'
import {
  mapWeatherApiLocationToForecastLocation,
  mapWeatherApiLocationToLocationSearchResult,
} from '../parsers/weatherAuLocationMapper'
import { WeatherApi } from '../weather-au'

export async function searchLiveLocations(query: string, limit: number) {
  const cacheKey = `bom:live:weather-api:search:${query}:${limit}`

  return withCache(cacheKey, 1000 * 60 * 5, async () => {
    const api = new WeatherApi()
    const searchResults = await api.search(query)

    const selectedResults = searchResults.slice(0, limit)
    const locations = await Promise.all(
      selectedResults.map(async (result) => {
        const locationApi = new WeatherApi({ geohash: result.geohash })

        return locationApi.location()
      }),
    )

    return locations
      .filter((location): location is NonNullable<typeof location> => location !== null)
      .map((location) => mapWeatherApiLocationToLocationSearchResult(location))
  })
}

export async function getLiveWeatherApiLocation(geohash: string) {
  const cacheKey = `bom:live:weather-api:location:${geohash.slice(0, 6)}`

  return withCache(cacheKey, 1000 * 60 * 10, async () => {
    const api = new WeatherApi({ geohash })

    return api.location()
  })
}

export async function getDynamicForecastLocation(locationId: string) {
  const geohash = locationId.replace(/^weather-api:/, '')
  const location = await getLiveWeatherApiLocation(geohash)

  if (!location) {
    return null
  }

  return mapWeatherApiLocationToForecastLocation(location, {
    locationId: toDynamicWeatherApiLocationId(geohash),
    stationId: toDynamicWeatherApiLocationId(geohash),
    forecastProductId: 'weather-api',
  })
}
