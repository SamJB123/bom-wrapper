import { buildForecastUrl, bomAttribution } from '../source-config'
import { getBomDataMode } from '../mode'
import {
  getDefaultProviderForMode,
  getOrderedLiveProviders,
} from '../providers'
import { listPointPlaceMetadata } from '../sources/pointPlaceSource'
import { listStationMetadata } from '../sources/stationSource'
import {
  healthResponseSchema,
  sourceListResponseSchema,
  type SourceCapability,
} from '../types'

async function buildSourceCapabilities(): Promise<Array<SourceCapability>> {
  const mode = getBomDataMode()
  const activeProvider = getDefaultProviderForMode(mode)
  const liveProviders = getOrderedLiveProviders()
  const [stations, locations] = await Promise.all([
    listStationMetadata(),
    listPointPlaceMetadata(),
  ])

  const observationProductIds = [...new Set(stations.map((item) => item.observationProductId))]
  const forecastProductIds = [...new Set(locations.map((item) => item.forecastProductId))]
  const xmlForecastBaseConfigured = Boolean(
    forecastProductIds.map((productId) => buildForecastUrl(productId)).find(Boolean),
  )
  const forecastLiveStatus =
    mode === 'fixture'
      ? 'fixture'
      : activeProvider === 'weather-api' || xmlForecastBaseConfigured
        ? 'ok'
        : 'degraded'

  return [
    {
      id: 'station-metadata',
      label: 'Curated station metadata',
      category: 'metadata',
      mode,
      activeProvider: 'fixture',
      status: 'fixture',
      description:
        'Curated station metadata links station identifiers, WMO IDs, coordinates, and BOM product IDs for this demo.',
      productIds: observationProductIds,
      supportsLiveFetch: false,
      note: 'Metadata is bundled with the app to keep local development deterministic.',
    },
    {
      id: 'forecast-location-metadata',
      label: 'Curated forecast place metadata',
      category: 'metadata',
      mode,
      activeProvider: 'fixture',
      status: 'fixture',
      description:
        'Curated forecast place metadata maps location IDs to coordinates and BOM forecast products.',
      productIds: forecastProductIds,
      supportsLiveFetch: false,
      note: 'Forecast place metadata is bundled with the app in fixture mode.',
    },
    {
      id: 'observations',
      label: 'Observation feeds',
      category: 'observations',
      mode,
      activeProvider,
      status: mode === 'fixture' ? 'fixture' : 'ok',
      description:
        'Current weather observations are sourced from the active provider stack, with weather-api and FWO JSON support behind the normalized API.',
      productIds: observationProductIds,
      supportsLiveFetch: true,
      note:
        mode === 'fixture'
          ? 'Fixture mode is active by default in this environment.'
          : `Live mode will try ${liveProviders.join(' then ')}.`,
    },
    {
      id: 'forecasts',
      label: 'City forecast feeds',
      category: 'forecasts',
      mode,
      activeProvider,
      status: forecastLiveStatus,
      description:
        'Daily forecast periods are derived from the active provider stack, with weather-api first in live mode and XML fallback where configured.',
      productIds: forecastProductIds,
      supportsLiveFetch: true,
      note:
        mode === 'fixture'
          ? 'Fixture mode is active by default in this environment.'
          : xmlForecastBaseConfigured
            ? `Live mode will try ${liveProviders.join(' then ')}.`
            : `Live mode will try ${liveProviders.join(' then ')}. XML fallback requires BOM_FORECAST_BASE_URL if the FWO provider is selected.`,
    },
  ]
}

export async function getSourceList() {
  const items = await buildSourceCapabilities()

  return sourceListResponseSchema.parse({
    items,
    attribution: bomAttribution,
  })
}

export async function getHealthStatus() {
  const items = await buildSourceCapabilities()
  const hasProblemSource = items.some(
    (item) => item.status === 'blocked' || item.status === 'degraded',
  )

  return healthResponseSchema.parse({
    status: hasProblemSource ? 'degraded' : 'ok',
    generatedAt: new Date().toISOString(),
    dataMode: getBomDataMode(),
    provider: getDefaultProviderForMode(getBomDataMode()),
    sourceStatuses: items.map((item) => ({
      id: item.id,
      provider: item.activeProvider,
      status: item.status,
    })),
  })
}
