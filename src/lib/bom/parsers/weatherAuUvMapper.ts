import { uvResponseSchema } from '../types'
import type { ForecastLocation } from '../types'

export function mapWeatherAuUvMessageToResponse(
  location: ForecastLocation,
  aac: string | null,
  message: string | null,
  fetchedAt: string,
) {
  return uvResponseSchema.parse({
    locationId: location.id,
    aac,
    message,
    source: {
      dataset: 'BOM UV index XML',
      provider: 'fwo-json',
      channel: 'http',
      status: 'ok',
      productId: aac ?? undefined,
      note: 'Live UV alert sourced from BOM UV XML products via the weather-au TypeScript port.',
      fetchedAt,
    },
  })
}
