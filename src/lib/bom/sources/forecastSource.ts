import { forecastFixtures } from '~/test/fixtures/bom/forecasts'
import { withCache } from '../cache'
import { unsupportedLiveSource } from '../errors'
import { fetchUpstreamText } from '../http'
import { getBomDataMode } from '../mode'
import { buildForecastUrl } from '../source-config'
import type { ForecastLocation } from '../types'

export async function loadRawForecastPayload(location: ForecastLocation) {
  const mode = getBomDataMode()
  const cacheKey = `bom:forecast:${mode}:${location.forecastProductId}`

  return withCache(cacheKey, 1000 * 60 * 15, async () => {
    if (mode === 'fixture') {
      const fixture =
        forecastFixtures[
          location.forecastProductId as keyof typeof forecastFixtures
        ]

      if (!fixture) {
        throw unsupportedLiveSource(
          `No forecast fixture exists for ${location.forecastProductId}`,
        )
      }

      return fixture
    }

    const url = buildForecastUrl(location.forecastProductId)

    if (!url) {
      throw unsupportedLiveSource(
        'Live forecast fetching requires VITE_BOM_FORECAST_BASE_URL or BOM_FORECAST_BASE_URL to be configured.',
      )
    }

    return fetchUpstreamText(url)
  })
}
