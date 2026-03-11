import { z } from 'zod'
import { parseFailure } from '../errors'
import { forecastLocationSchema } from '../types'

const pointPlaceLineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  state: z.string().min(1),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  timezone: z.string().min(1),
  forecastProductId: z.string().min(1),
  stationId: z.string().min(1),
})

export function parsePointPlaceMetadata(rawText: string) {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))

  return lines.map((line) => {
    const parts = line.split('|')

    if (parts.length !== 8) {
      throw parseFailure(`Unexpected point place metadata line: ${line}`)
    }

    const parsedLine = pointPlaceLineSchema.parse({
      id: parts[0],
      name: parts[1],
      state: parts[2],
      latitude: parts[3],
      longitude: parts[4],
      timezone: parts[5],
      forecastProductId: parts[6],
      stationId: parts[7],
    })

    return forecastLocationSchema.parse({
      ...parsedLine,
      coordinates: {
        latitude: parsedLine.latitude,
        longitude: parsedLine.longitude,
      },
    })
  })
}
