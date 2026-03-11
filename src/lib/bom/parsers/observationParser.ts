import { z } from 'zod'
import { notFound, parseFailure } from '../errors'
import type { ObservationStation } from '../types'
import { observationSnapshotSchema } from '../types'

const rawHeaderSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  time_zone: z.string().optional(),
})

const rawObservationRowSchema = z.object({
  wmo: z.union([z.string(), z.number()]).transform((value) => String(value)),
  name: z.string(),
  local_date_time: z.string(),
  local_date_time_full: z.string(),
  aifstime_utc: z.string(),
  air_temp: z.coerce.number(),
  apparent_t: z.coerce.number().nullable().optional(),
  dewpt: z.coerce.number().nullable().optional(),
  rel_hum: z.coerce.number().nullable().optional(),
  wind_dir: z.string().nullable().optional(),
  wind_spd_kmh: z.coerce.number().nullable().optional(),
  gust_kmh: z.coerce.number().nullable().optional(),
  press: z.coerce.number().nullable().optional(),
  press_msl: z.coerce.number().nullable().optional(),
  rain_trace: z.union([z.string(), z.number()]).nullable().optional(),
})

const rawObservationSchema = z.object({
  observations: z.object({
    header: z.array(rawHeaderSchema),
    data: z.array(rawObservationRowSchema),
  }),
})

function parseCompactUtcDate(value: string) {
  if (!/^\d{14}$/.test(value)) {
    throw parseFailure(`Unexpected BOM UTC timestamp: ${value}`)
  }

  const year = value.slice(0, 4)
  const month = value.slice(4, 6)
  const day = value.slice(6, 8)
  const hour = value.slice(8, 10)
  const minute = value.slice(10, 12)
  const second = value.slice(12, 14)

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
}

function parseRainTrace(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const numberValue = typeof value === 'number' ? value : Number.parseFloat(value)

  return Number.isNaN(numberValue) ? null : numberValue
}

export function parseObservationSnapshot(
  rawObservation: unknown,
  station: ObservationStation,
) {
  const parsedObservation = rawObservationSchema.safeParse(rawObservation)

  if (!parsedObservation.success) {
    throw parseFailure('Observation payload did not match the expected shape')
  }

  const matchingRow = parsedObservation.data.observations.data.find(
    (row) => row.wmo === station.wmoId,
  )

  if (!matchingRow) {
    throw notFound(
      `Observation payload did not contain station ${station.name} (${station.wmoId})`,
    )
  }

  const header = parsedObservation.data.observations.header[0]

  return observationSnapshotSchema.parse({
    stationId: station.id,
    stationName: matchingRow.name,
    observedAt: parseCompactUtcDate(matchingRow.aifstime_utc),
    localDateTime: matchingRow.local_date_time,
    airTemperatureC: matchingRow.air_temp,
    apparentTemperatureC: matchingRow.apparent_t ?? null,
    dewPointC: matchingRow.dewpt ?? null,
    relativeHumidityPct: matchingRow.rel_hum ?? null,
    windDirection: matchingRow.wind_dir ?? null,
    windSpeedKmh: matchingRow.wind_spd_kmh ?? null,
    windGustKmh: matchingRow.gust_kmh ?? null,
    pressureHpa: matchingRow.press_msl ?? matchingRow.press ?? null,
    rainfallSince9amMm: parseRainTrace(matchingRow.rain_trace),
    source: {
      dataset: header?.name ?? 'BOM observations',
      channel: 'fixture',
      status: 'fixture',
      productId: station.observationProductId,
      fetchedAt: new Date().toISOString(),
      issuedAt: parseCompactUtcDate(matchingRow.aifstime_utc),
      note: 'Fixture-backed observation parsed from a BOM-style JSON payload.',
    },
  })
}
