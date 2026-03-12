import { withCache } from '../cache'
import { getLiveMappingByStationId } from '../liveMappings'
import { mapWeatherApiObservationToSnapshot } from '../parsers/weatherAuObservationMapper'
import { listStationMetadata } from './stationSource'
import { fetchWeatherAuJson } from '../weather-au/http'
import { parseWeatherApiLocationResponse, parseWeatherApiObservationResponse } from '../weather-au/parsers/weatherApi'
import { buildWeatherApiLocationEndpointUrl, buildWeatherApiLocationUrl } from '../weather-au/config'

export async function getLiveObservationForStation(stationId: string) {
  const mapping = getLiveMappingByStationId(stationId)

  if (!mapping) {
    return null
  }

  const cacheKey = `bom:live:weather-api:observation:${stationId}:${mapping.geohash}`

  return withCache(cacheKey, 1000 * 60 * 5, async () => {
    const stations = await listStationMetadata()
    const station = stations.find((item) => item.id === stationId)

    if (!station) {
      return null
    }

    const [locationResponse, observationResponse] = await Promise.all([
      fetchWeatherAuJson(
        buildWeatherApiLocationUrl(mapping.geohash),
      ).then((payload) => parseWeatherApiLocationResponse(payload)),
      fetchWeatherAuJson(
        buildWeatherApiLocationEndpointUrl(mapping.geohash, 'observations'),
      ).then((payload) => parseWeatherApiObservationResponse(payload)),
    ])

    return mapWeatherApiObservationToSnapshot(
      observationResponse,
      station,
      locationResponse.data,
    )
  })
}
