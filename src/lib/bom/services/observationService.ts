import { notFound } from '../errors'
import { parseObservationSnapshot } from '../parsers/observationParser'
import { loadRawObservationPayload } from '../sources/observationSource'
import { listStationMetadata } from '../sources/stationSource'
import { stationListResponseSchema } from '../types'

export async function listStations() {
  const stations = await listStationMetadata()

  return stationListResponseSchema.parse({
    items: stations,
    total: stations.length,
  })
}

export async function getStation(stationId: string) {
  const stations = await listStationMetadata()
  const station = stations.find((item) => item.id === stationId)

  if (!station) {
    throw notFound(`Unknown station: ${stationId}`)
  }

  return station
}

export async function getObservation(stationId: string) {
  const station = await getStation(stationId)
  const rawPayload = await loadRawObservationPayload(station)

  return parseObservationSnapshot(rawPayload, station)
}
