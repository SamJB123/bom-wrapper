import { getBomDataMode } from '../mode'
import { getLiveWarningsForLocation } from '../sources/liveForecastSource'
import { locationWarningsResponseSchema } from '../types'

export async function getLocationWarnings(locationId: string) {
  const mode = getBomDataMode()

  if (mode === 'fixture') {
    return locationWarningsResponseSchema.parse({
      locationId,
      items: [],
    })
  }

  const liveWarnings = await getLiveWarningsForLocation(locationId)

  return locationWarningsResponseSchema.parse(
    liveWarnings ?? {
      locationId,
      items: [],
    },
  )
}
