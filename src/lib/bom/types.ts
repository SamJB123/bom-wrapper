import { z } from 'zod'

export const bomDataModeSchema = z.enum(['fixture', 'live'])
export type BomDataMode = z.infer<typeof bomDataModeSchema>

export const sourceStatusSchema = z.enum([
  'fixture',
  'ok',
  'blocked',
  'unavailable',
  'degraded',
])
export type SourceStatus = z.infer<typeof sourceStatusSchema>

export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})
export type Coordinate = z.infer<typeof coordinateSchema>

export const sourceTraceSchema = z.object({
  dataset: z.string(),
  channel: z.enum(['fixture', 'http', 'manual']),
  status: sourceStatusSchema,
  productId: z.string().optional(),
  url: z.string().url().optional(),
  note: z.string().optional(),
  fetchedAt: z.string().datetime(),
  issuedAt: z.string().datetime().optional(),
})
export type SourceTrace = z.infer<typeof sourceTraceSchema>

export const observationStationSchema = z.object({
  id: z.string(),
  wmoId: z.string(),
  name: z.string(),
  state: z.string(),
  timezone: z.string(),
  coordinates: coordinateSchema,
  elevationMetres: z.number().nullable(),
  observationProductId: z.string(),
  forecastLocationId: z.string(),
})
export type ObservationStation = z.infer<typeof observationStationSchema>

export const forecastLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.string(),
  timezone: z.string(),
  coordinates: coordinateSchema,
  forecastProductId: z.string(),
  stationId: z.string(),
})
export type ForecastLocation = z.infer<typeof forecastLocationSchema>

export const observationSnapshotSchema = z.object({
  stationId: z.string(),
  stationName: z.string(),
  observedAt: z.string().datetime(),
  localDateTime: z.string(),
  airTemperatureC: z.number(),
  apparentTemperatureC: z.number().nullable(),
  dewPointC: z.number().nullable(),
  relativeHumidityPct: z.number().nullable(),
  windDirection: z.string().nullable(),
  windSpeedKmh: z.number().nullable(),
  windGustKmh: z.number().nullable(),
  pressureHpa: z.number().nullable(),
  rainfallSince9amMm: z.number().nullable(),
  source: sourceTraceSchema,
})
export type ObservationSnapshot = z.infer<typeof observationSnapshotSchema>

export const forecastPeriodSchema = z.object({
  locationId: z.string(),
  date: z.string(),
  startTimeLocal: z.string().datetime(),
  endTimeLocal: z.string().datetime(),
  precis: z.string(),
  detailedText: z.string().nullable(),
  minTempC: z.number().nullable(),
  maxTempC: z.number().nullable(),
  precipitationProbabilityPct: z.number().nullable(),
  precipitationRange: z.string().nullable(),
  source: sourceTraceSchema,
})
export type ForecastPeriod = z.infer<typeof forecastPeriodSchema>

export const forecastResponseSchema = z.object({
  location: forecastLocationSchema,
  periods: z.array(forecastPeriodSchema),
})
export type ForecastResponse = z.infer<typeof forecastResponseSchema>

export const locationSearchResultSchema = z.object({
  id: z.string(),
  kind: z.enum(['station', 'forecast-location']),
  name: z.string(),
  state: z.string(),
  subtitle: z.string(),
  coordinates: coordinateSchema,
  stationId: z.string().nullable(),
  locationId: z.string().nullable(),
})
export type LocationSearchResult = z.infer<typeof locationSearchResultSchema>

export const australiaOverviewMarkerSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.string(),
  coordinates: coordinateSchema,
  station: observationStationSchema,
  location: forecastLocationSchema,
  observation: observationSnapshotSchema,
  forecastSummary: z.object({
    precis: z.string(),
    maxTempC: z.number().nullable(),
    minTempC: z.number().nullable(),
    precipitationProbabilityPct: z.number().nullable(),
  }),
})
export type AustraliaOverviewMarker = z.infer<
  typeof australiaOverviewMarkerSchema
>

export const bomAttributionSchema = z.object({
  provider: z.literal('Bureau of Meteorology'),
  notice: z.string(),
  usage: z.string(),
  moreInfoUrl: z.string().url(),
})
export type BomAttribution = z.infer<typeof bomAttributionSchema>

export const australiaOverviewResponseSchema = z.object({
  generatedAt: z.string().datetime(),
  dataMode: bomDataModeSchema,
  markers: z.array(australiaOverviewMarkerSchema),
  attribution: bomAttributionSchema,
})
export type AustraliaOverviewResponse = z.infer<
  typeof australiaOverviewResponseSchema
>

export const sourceCapabilitySchema = z.object({
  id: z.string(),
  label: z.string(),
  category: z.enum(['metadata', 'observations', 'forecasts']),
  mode: bomDataModeSchema,
  status: sourceStatusSchema,
  description: z.string(),
  productIds: z.array(z.string()),
  supportsLiveFetch: z.boolean(),
  note: z.string().optional(),
})
export type SourceCapability = z.infer<typeof sourceCapabilitySchema>

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  generatedAt: z.string().datetime(),
  dataMode: bomDataModeSchema,
  sourceStatuses: z.array(
    z.object({
      id: z.string(),
      status: sourceStatusSchema,
    }),
  ),
})
export type HealthResponse = z.infer<typeof healthResponseSchema>

export const stationListResponseSchema = z.object({
  items: z.array(observationStationSchema),
  total: z.number().int().nonnegative(),
})
export type StationListResponse = z.infer<typeof stationListResponseSchema>

export const sourceListResponseSchema = z.object({
  items: z.array(sourceCapabilitySchema),
  attribution: bomAttributionSchema,
})
export type SourceListResponse = z.infer<typeof sourceListResponseSchema>

export const locationSearchResponseSchema = z.object({
  items: z.array(locationSearchResultSchema),
  total: z.number().int().nonnegative(),
})
export type LocationSearchResponse = z.infer<typeof locationSearchResponseSchema>
