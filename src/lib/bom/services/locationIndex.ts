import { listPointPlaceMetadata } from '../sources/pointPlaceSource'
import { listStationMetadata } from '../sources/stationSource'
import { locationSearchResponseSchema } from '../types'

function toSearchableText(...values: Array<string | null | undefined>) {
  return values
    .filter((value): value is string => Boolean(value))
    .join(' ')
    .toLowerCase()
}

export async function searchLocations(options?: {
  q?: string
  kind?: 'station' | 'forecast-location'
  limit?: number
}) {
  const [stations, locations] = await Promise.all([
    listStationMetadata(),
    listPointPlaceMetadata(),
  ])

  const query = options?.q?.trim().toLowerCase() ?? ''
  const limit = Math.max(1, Math.min(options?.limit ?? 20, 50))
  const kind = options?.kind

  const stationResults =
    kind === 'forecast-location'
      ? []
      : stations.map((station) => ({
          id: station.id,
          kind: 'station' as const,
          name: station.name,
          state: station.state,
          subtitle: `${station.state} • station • WMO ${station.wmoId}`,
          coordinates: station.coordinates,
          stationId: station.id,
          locationId: station.forecastLocationId,
          searchText: toSearchableText(station.name, station.state, station.wmoId),
        }))

  const locationResults =
    kind === 'station'
      ? []
      : locations.map((location) => ({
          id: location.id,
          kind: 'forecast-location' as const,
          name: location.name,
          state: location.state,
          subtitle: `${location.state} • forecast location`,
          coordinates: location.coordinates,
          stationId: location.stationId,
          locationId: location.id,
          searchText: toSearchableText(location.name, location.state),
        }))

  const items = [...stationResults, ...locationResults]
    .filter((item) => (query ? item.searchText.includes(query) : true))
    .slice(0, limit)
    .map(({ searchText: _searchText, ...item }) => item)

  return locationSearchResponseSchema.parse({
    items,
    total: items.length,
  })
}
