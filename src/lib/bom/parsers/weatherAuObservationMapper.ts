import { observationSnapshotSchema } from '../types'
import type { ObservationStation } from '../types'
import type {
  WeatherApiEnvelope,
  WeatherApiLocation,
  WeatherApiObservation,
} from '../weather-au'

function formatLocalDateTime(value: string, timezone: string) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(new Date(value))
}

export function mapWeatherApiObservationToSnapshot(
  response: WeatherApiEnvelope<WeatherApiObservation>,
  station: ObservationStation,
  location: WeatherApiLocation,
) {
  const observedAt =
    response.metadata.observation_time ??
    response.metadata.issue_time ??
    response.metadata.response_timestamp

  return observationSnapshotSchema.parse({
    stationId: station.id,
    stationName: response.data.station?.name ?? station.name,
    observedAt,
    localDateTime: formatLocalDateTime(observedAt, location.timezone),
    airTemperatureC: response.data.temp,
    apparentTemperatureC: response.data.temp_feels_like ?? null,
    dewPointC: response.data.dew_point ?? null,
    relativeHumidityPct:
      response.data.humidity ?? response.data.relative_humidity ?? null,
    windDirection: response.data.wind?.direction ?? null,
    windSpeedKmh:
      response.data.wind?.speed_kilometre ??
      response.data.wind?.gust_speed_kilometre ??
      null,
    windGustKmh:
      response.data.gust?.speed_kilometre ??
      response.data.max_gust?.speed_kilometre ??
      response.data.wind?.gust_speed_kilometre ??
      null,
    pressureHpa: null,
    rainfallSince9amMm: response.data.rain_since_9am ?? null,
    source: {
      dataset: 'BOM Weather API observations',
      provider: 'weather-api',
      channel: 'http',
      status: 'ok',
      productId: response.data.station?.bom_id,
      note: 'Live observation sourced from the BOM Weather API family referenced by weather-au.',
      fetchedAt: response.metadata.response_timestamp,
      issuedAt: response.metadata.issue_time,
    },
  })
}
