import { getBomDataMode } from '../mode'
import { getForecastLocation } from './forecastService'
import { getLiveUvForLocation } from '../sources/liveUvSource'
import { uvResponseSchema } from '../types'

export async function getLocationUv(locationId: string) {
  const mode = getBomDataMode()

  if (mode === 'fixture') {
    return uvResponseSchema.parse({
      locationId,
      aac: null,
      message: null,
      source: {
        dataset: 'BOM UV index XML',
        provider: 'fixture',
        channel: 'fixture',
        status: 'fixture',
        note: 'UV messages are available when live mode is enabled.',
        fetchedAt: new Date().toISOString(),
      },
    })
  }

  const liveUv = await getLiveUvForLocation(locationId)

  if (liveUv) {
    return liveUv
  }

  const location = await getForecastLocation(locationId)

  return uvResponseSchema.parse({
    locationId: location.id,
    aac: null,
    message: null,
    source: {
      dataset: 'BOM UV index XML',
      provider: 'fwo-json',
      channel: 'http',
      status: 'degraded',
      note: 'No UV mapping was available for this location.',
      fetchedAt: new Date().toISOString(),
    },
  })
}
