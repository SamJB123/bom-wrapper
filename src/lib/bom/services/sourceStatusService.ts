import { buildForecastUrl, bomAttribution } from '../source-config'
import { getBomDataMode } from '../mode'
import { listPointPlaceMetadata } from '../sources/pointPlaceSource'
import { listStationMetadata } from '../sources/stationSource'
import {
  healthResponseSchema,
  sourceListResponseSchema,
  type SourceCapability,
} from '../types'

async function buildSourceCapabilities(): Promise<Array<SourceCapability>> {
  const mode = getBomDataMode()
  const [stations, locations] = await Promise.all([
    listStationMetadata(),
    listPointPlaceMetadata(),
  ])

  const observationProductIds = [...new Set(stations.map((item) => item.observationProductId))]
  const forecastProductIds = [...new Set(locations.map((item) => item.forecastProductId))]
  const forecastBaseConfigured = Boolean(
    forecastProductIds.map((productId) => buildForecastUrl(productId)).find(Boolean),
  )

  return [
    {
      id: 'station-metadata',
      label: 'Curated station metadata',
      category: 'metadata',
      mode,
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
      status: mode === 'fixture' ? 'fixture' : 'ok',
      description:
        'Current weather observations are sourced from BOM-style JSON payloads keyed by station product and WMO ID.',
      productIds: observationProductIds,
      supportsLiveFetch: true,
      note:
        mode === 'fixture'
          ? 'Fixture mode is active by default in this environment.'
          : 'Live mode targets documented observation JSON feed URLs.',
    },
    {
      id: 'forecasts',
      label: 'City forecast feeds',
      category: 'forecasts',
      mode,
      status: mode === 'fixture' ? 'fixture' : forecastBaseConfigured ? 'ok' : 'degraded',
      description:
        'Daily forecast periods are derived from BOM-style XML city forecast packages.',
      productIds: forecastProductIds,
      supportsLiveFetch: forecastBaseConfigured,
      note:
        mode === 'fixture'
          ? 'Fixture mode is active by default in this environment.'
          : forecastBaseConfigured
            ? 'Live forecast base URL is configured.'
            : 'Set VITE_BOM_FORECAST_BASE_URL or BOM_FORECAST_BASE_URL to enable live forecast retrieval.',
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
    sourceStatuses: items.map((item) => ({
      id: item.id,
      status: item.status,
    })),
  })
}
