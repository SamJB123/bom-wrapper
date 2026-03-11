import { z } from 'zod'
import { parseFailure } from '../errors'
import { observationStationSchema } from '../types'

const stationLineSchema = z.object({
  id: z.string().min(1),
  wmoId: z.string().min(1),
  name: z.string().min(1),
  state: z.string().min(1),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  elevationMetres: z.coerce.number(),
  timezone: z.string().min(1),
  observationProductId: z.string().min(1),
  forecastLocationId: z.string().min(1),
})

export function parseStationMetadata(rawText: string) {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))

  return lines.map((line) => {
    const parts = line.split('|')

    if (parts.length !== 10) {
      throw parseFailure(`Unexpected station metadata line: ${line}`)
    }

    const parsedLine = stationLineSchema.parse({
      id: parts[0],
      wmoId: parts[1],
      name: parts[2],
      state: parts[3],
      latitude: parts[4],
      longitude: parts[5],
      elevationMetres: parts[6],
      timezone: parts[7],
      observationProductId: parts[8],
      forecastLocationId: parts[9],
    })

    return observationStationSchema.parse({
      ...parsedLine,
      coordinates: {
        latitude: parsedLine.latitude,
        longitude: parsedLine.longitude,
      },
    })
  })
}
