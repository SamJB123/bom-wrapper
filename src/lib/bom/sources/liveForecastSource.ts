import { withCache } from '../cache'
import {
  getDynamicWeatherApiGeohash,
  getLiveMappingByLocationId,
  isDynamicWeatherApiLocationId,
  toDynamicWeatherApiLocationId,
} from '../liveMappings'
import { mapWeatherApiDailyForecastsToPeriods } from '../parsers/weatherAuForecastMapper'
import { mapWeatherApiLocationToForecastLocation } from '../parsers/weatherAuLocationMapper'
import { listPointPlaceMetadata } from './pointPlaceSource'
import { fetchWeatherAuJson } from '../weather-au/http'
import {
  parseWeatherApiDailyForecastResponse,
  parseWeatherApiLocationResponse,
  parseWeatherApiWarningDetailResponse,
  parseWeatherApiWarningsResponse,
} from '../weather-au/parsers/weatherApi'
import {
  buildWeatherApiLocationEndpointUrl,
  buildWeatherApiLocationUrl,
  buildWeatherApiWarningUrl,
} from '../weather-au/config'
import { warningSummarySchema } from '../types'

export async function getLiveForecastForLocation(locationId: string) {
  const mapping = getLiveMappingByLocationId(locationId)
  const dynamicGeohash = getDynamicWeatherApiGeohash(locationId)
  const geohash = mapping?.geohash ?? dynamicGeohash

  if (!geohash) {
    return null
  }

  const cacheKey = `bom:live:weather-api:forecast:${locationId}:${geohash}`

  return withCache(cacheKey, 1000 * 60 * 15, async () => {
    const [metadataLocations, locationResponse, forecastResponse] =
      await Promise.all([
        listPointPlaceMetadata(),
        fetchWeatherAuJson(buildWeatherApiLocationUrl(geohash)).then((payload) =>
          parseWeatherApiLocationResponse(payload),
        ),
        fetchWeatherAuJson(
          buildWeatherApiLocationEndpointUrl(geohash, 'forecasts/daily'),
        ).then((payload) => parseWeatherApiDailyForecastResponse(payload)),
      ])

    const knownLocation = metadataLocations.find((item) => item.id === locationId)
    const normalizedLocation = knownLocation
      ? knownLocation
      : mapWeatherApiLocationToForecastLocation(locationResponse.data, {
          locationId: isDynamicWeatherApiLocationId(locationId)
            ? toDynamicWeatherApiLocationId(geohash)
            : locationId,
          stationId: mapping?.stationId ?? toDynamicWeatherApiLocationId(geohash),
          forecastProductId: 'weather-api',
        })

    return {
      location: normalizedLocation,
      periods: mapWeatherApiDailyForecastsToPeriods(
        forecastResponse,
        normalizedLocation,
      ),
    }
  })
}

export async function getLiveWarningsForLocation(locationId: string) {
  const mapping = getLiveMappingByLocationId(locationId)
  const dynamicGeohash = getDynamicWeatherApiGeohash(locationId)
  const geohash = mapping?.geohash ?? dynamicGeohash

  if (!geohash) {
    return null
  }

  const cacheKey = `bom:live:weather-api:warnings:${locationId}:${geohash}`

  return withCache(cacheKey, 1000 * 60 * 5, async () => {
    const warningsResponse = await fetchWeatherAuJson(
      buildWeatherApiLocationEndpointUrl(geohash, 'warnings'),
    ).then((payload) => parseWeatherApiWarningsResponse(payload))

    const details = await Promise.all(
      warningsResponse.data.map(async (warning) => {
        const detailResponse = await fetchWeatherAuJson(
          buildWeatherApiWarningUrl(warning.id),
        ).then((payload) => parseWeatherApiWarningDetailResponse(payload))

        return warningSummarySchema.parse({
          id: detailResponse.data.id,
          type: detailResponse.data.type,
          state: detailResponse.data.state,
          shortTitle: detailResponse.data.short_title,
          title: detailResponse.data.title,
          issueTime: detailResponse.data.issue_time ?? null,
          expiryTime: detailResponse.data.expiry_time ?? null,
          phase: detailResponse.data.phase ?? null,
          messageHtml: detailResponse.data.message ?? null,
          source: {
            dataset: 'BOM Weather API warnings',
            provider: 'weather-api',
            channel: 'http',
            status: 'ok',
            productId: detailResponse.data.id,
            note: 'Live warning sourced from the BOM Weather API family referenced by weather-au.',
            fetchedAt: detailResponse.metadata.response_timestamp,
            issuedAt: detailResponse.metadata.issue_time,
          },
        })
      }),
    )

    return {
      locationId,
      items: details,
    }
  })
}
