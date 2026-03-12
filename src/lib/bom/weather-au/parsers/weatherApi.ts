import { z } from 'zod'
import { WeatherAuParseError } from '../errors'
import type {
  WeatherApiDailyForecast,
  WeatherApiEnvelope,
  WeatherApiHourlyForecast,
  WeatherApiLocation,
  WeatherApiMetadata,
  WeatherApiObservation,
  WeatherApiRainForecast,
  WeatherApiSearchResult,
  WeatherApiWarningDetail,
  WeatherApiWarningSummary,
} from '../types'

const metadataSchema = z.object({
  response_timestamp: z.string(),
  copyright: z.string(),
  issue_time: z.string().optional(),
  observation_time: z.string().optional(),
})

const searchResultSchema = z.object({
  geohash: z.string(),
  id: z.string(),
  name: z.string(),
  postcode: z.string().optional(),
  state: z.string(),
})

const locationSchema = z.object({
  geohash: z.string(),
  timezone: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  marine_area_id: z.string().nullable().optional(),
  tidal_point: z.string().nullable().optional(),
  has_wave: z.boolean().optional(),
  id: z.string(),
  name: z.string(),
  state: z.string(),
})

const warningSummarySchema = z.object({
  id: z.string(),
  state: z.string(),
  expiry_time: z.string().optional(),
  issue_time: z.string().optional(),
  type: z.string(),
  short_title: z.string(),
  warning_group_type: z.string().optional(),
  phase: z.string().optional(),
})

const warningDetailSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  short_title: z.string(),
  state: z.string(),
  message: z.string(),
  issue_time: z.string().optional(),
  expiry_time: z.string().optional(),
  phase: z.string().optional(),
})

const windSchema = z.object({
  speed_kilometre: z.number().optional(),
  speed_knot: z.number().optional(),
  direction: z.string().optional(),
  gust_speed_knot: z.number().optional(),
  gust_speed_kilometre: z.number().optional(),
})

const observationSchema = z.object({
  temp: z.number(),
  temp_feels_like: z.number().optional(),
  wind: windSchema.nullable().optional(),
  gust: z
    .object({
      speed_kilometre: z.number().optional(),
      speed_knot: z.number().optional(),
    })
    .nullable()
    .optional(),
  max_gust: z
    .object({
      speed_kilometre: z.number().optional(),
      speed_knot: z.number().optional(),
      time: z.string().optional(),
    })
    .nullable()
    .optional(),
  max_temp: z
    .object({
      time: z.string().optional(),
      value: z.number().optional(),
    })
    .nullable()
    .optional(),
  min_temp: z
    .object({
      time: z.string().optional(),
      value: z.number().optional(),
    })
    .nullable()
    .optional(),
  rain_since_9am: z.number().optional(),
  humidity: z.number().optional(),
  station: z
    .object({
      bom_id: z.string().optional(),
      name: z.string().optional(),
      distance: z.number().optional(),
    })
    .nullable()
    .optional(),
  dew_point: z.number().optional(),
  relative_humidity: z.number().optional(),
  uv: z.number().optional(),
})

const rainAmountSchema = z.object({
  min: z.number().nullable(),
  max: z.number().nullable(),
  units: z.string(),
  lower_range: z.number().nullable().optional(),
  upper_range: z.number().nullable().optional(),
})

const rainForecastSchema = z.object({
  amount: rainAmountSchema,
  chance: z.number(),
  start_time: z.string().optional(),
  period: z.string().optional(),
})

const dailyForecastSchema = z.object({
  rain: z
    .object({
      amount: rainAmountSchema.optional(),
      chance: z.number().optional(),
      chance_of_no_rain_category: z.string().optional(),
      precipitation_amount_25_percent_chance: z.number().optional(),
      precipitation_amount_50_percent_chance: z.number().optional(),
      precipitation_amount_75_percent_chance: z.number().optional(),
    })
    .optional(),
  uv: z
    .object({
      category: z.string().nullable().optional(),
      end_time: z.string().nullable().optional(),
      max_index: z.number().nullable().optional(),
      start_time: z.string().nullable().optional(),
    })
    .optional(),
  astronomical: z
    .object({
      sunrise_time: z.string().optional(),
      sunset_time: z.string().optional(),
    })
    .optional(),
  date: z.string(),
  temp_max: z.number().nullable().optional(),
  temp_min: z.number().nullable().optional(),
  extended_text: z.string().optional(),
  icon_descriptor: z.string().optional(),
  short_text: z.string().optional(),
  surf_danger: z.string().nullable().optional(),
  fire_danger: z.string().nullable().optional(),
  fire_danger_category: z
    .object({
      text: z.string().nullable().optional(),
      default_colour: z.string().nullable().optional(),
      dark_mode_colour: z.string().nullable().optional(),
    })
    .optional(),
  now: z
    .object({
      is_night: z.boolean().optional(),
      now_label: z.string().optional(),
      later_label: z.string().optional(),
      temp_now: z.number().nullable().optional(),
      temp_later: z.number().nullable().optional(),
    })
    .optional(),
})

const hourlyForecastSchema = z.object({
  rain: z
    .object({
      amount: rainAmountSchema.optional(),
      chance: z.number().optional(),
      precipitation_amount_10_percent_chance: z.number().optional(),
      precipitation_amount_25_percent_chance: z.number().optional(),
      precipitation_amount_50_percent_chance: z.number().optional(),
    })
    .optional(),
  temp: z.number().nullable().optional(),
  temp_feels_like: z.number().nullable().optional(),
  dew_point: z.number().nullable().optional(),
  wind: windSchema.optional(),
  relative_humidity: z.number().nullable().optional(),
  uv: z.number().nullable().optional(),
  icon_descriptor: z.string().optional(),
  next_three_hourly_forecast_period: z.string().optional(),
  time: z.string(),
  is_night: z.boolean().optional(),
  next_forecast_period: z.string().optional(),
})

const apiEnvelopeSchema = <TData extends z.ZodTypeAny>(dataSchema: TData) =>
  z.object({
    metadata: metadataSchema.optional(),
    data: dataSchema,
  })

function parseEnvelope<TData>(
  schema: z.ZodType<{ metadata?: WeatherApiMetadata; data: TData }>,
  value: unknown,
  message: string,
) {
  const parsed = schema.safeParse(value)

  if (!parsed.success) {
    throw new WeatherAuParseError(message, parsed.error.flatten())
  }

  return {
    metadata: {
      response_timestamp:
        parsed.data.metadata?.response_timestamp ?? new Date().toISOString(),
      copyright: parsed.data.metadata?.copyright ?? '',
      issue_time: parsed.data.metadata?.issue_time,
      observation_time: parsed.data.metadata?.observation_time,
    },
    data: parsed.data.data,
  } satisfies WeatherApiEnvelope<TData>
}

export function parseWeatherApiSearchResponse(value: unknown) {
  return parseEnvelope<Array<WeatherApiSearchResult>>(
    apiEnvelopeSchema(z.array(searchResultSchema)),
    value,
    'Unable to parse Weather API search response',
  )
}

export function parseWeatherApiLocationResponse(value: unknown) {
  return parseEnvelope<WeatherApiLocation>(
    apiEnvelopeSchema(locationSchema),
    value,
    'Unable to parse Weather API location response',
  )
}

export function parseWeatherApiWarningsResponse(value: unknown) {
  return parseEnvelope<Array<WeatherApiWarningSummary>>(
    apiEnvelopeSchema(z.array(warningSummarySchema)),
    value,
    'Unable to parse Weather API warnings response',
  )
}

export function parseWeatherApiWarningDetailResponse(value: unknown) {
  return parseEnvelope<WeatherApiWarningDetail>(
    apiEnvelopeSchema(warningDetailSchema),
    value,
    'Unable to parse Weather API warning detail response',
  )
}

export function parseWeatherApiObservationResponse(value: unknown) {
  return parseEnvelope<WeatherApiObservation>(
    apiEnvelopeSchema(observationSchema),
    value,
    'Unable to parse Weather API observation response',
  )
}

export function parseWeatherApiRainForecastResponse(value: unknown) {
  return parseEnvelope<WeatherApiRainForecast>(
    apiEnvelopeSchema(rainForecastSchema),
    value,
    'Unable to parse Weather API rain forecast response',
  )
}

export function parseWeatherApiDailyForecastResponse(value: unknown) {
  return parseEnvelope<Array<WeatherApiDailyForecast>>(
    apiEnvelopeSchema(z.array(dailyForecastSchema)),
    value,
    'Unable to parse Weather API daily forecast response',
  )
}

export function parseWeatherApiHourlyForecastResponse(value: unknown) {
  return parseEnvelope<Array<WeatherApiHourlyForecast>>(
    apiEnvelopeSchema(z.array(hourlyForecastSchema)),
    value,
    'Unable to parse Weather API hourly forecast response',
  )
}
