import { getBomDataMode } from '../mode'
import {
  getBomLiveProviderPreference,
  getOrderedLiveProviders,
} from '../providers'
import { notFound } from '../errors'
import { parseObservationSnapshot } from '../parsers/observationParser'
import {
  loadRawObservationPayload,
  loadRawObservationPayloadForProvider,
} from '../sources/observationSource'
import { getLiveObservationForStation } from '../sources/liveObservationSource'
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
  const mode = getBomDataMode()

  if (mode === 'fixture') {
    const rawPayload = await loadRawObservationPayload(station)

    return parseObservationSnapshot(rawPayload, station)
  }

  const liveProviderPreference = getBomLiveProviderPreference()
  let lastError: unknown = null

  for (const provider of getOrderedLiveProviders()) {
    try {
      if (provider === 'weather-api') {
        const observation = await getLiveObservationForStation(stationId)

        if (observation) {
          return observation
        }
      }

      if (provider === 'fwo-json') {
        const rawPayload = await loadRawObservationPayloadForProvider(
          station,
          'fwo-json',
        )

        return parseObservationSnapshot(rawPayload, station, {
          provider: 'fwo-json',
          status: 'ok',
          channel: 'http',
          note: 'Live observation parsed from the BOM FWO station JSON feed.',
          url: `https://www.bom.gov.au/fwo/${station.observationProductId}/${station.observationProductId}.${station.wmoId}.json`,
        })
      }
    } catch (error) {
      lastError = error

      if (liveProviderPreference !== 'auto') {
        throw error
      }
    }
  }

  if (lastError) {
    throw lastError
  }

  throw notFound(`No observation provider could resolve station ${stationId}`)
}
