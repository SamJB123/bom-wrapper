import { withCache } from '../cache'
import { getLiveMappingByLocationId } from '../liveMappings'
import { mapWeatherAuUvMessageToResponse } from '../parsers/weatherAuUvMapper'
import { listPointPlaceMetadata } from './pointPlaceSource'
import { UvIndex } from '../weather-au'

export async function getLiveUvForLocation(locationId: string) {
  const mapping = getLiveMappingByLocationId(locationId)

  if (!mapping) {
    return null
  }

  const cacheKey = `bom:live:uv:${locationId}:${mapping.uvState}:${mapping.uvLocationName}`

  return withCache(cacheKey, 1000 * 60 * 30, async () => {
    const [locations, uvIndex] = await Promise.all([
      listPointPlaceMetadata(),
      UvIndex.create({
        state: mapping.uvState,
      }),
    ])
    const location = locations.find((item) => item.id === locationId)

    if (!location) {
      return null
    }

    const aac = uvIndex.getAac(mapping.uvLocationName)
    const message = uvIndex.uvMessage(aac ?? undefined)

    return mapWeatherAuUvMessageToResponse(
      location,
      aac,
      message,
      new Date().toISOString(),
    )
  })
}
