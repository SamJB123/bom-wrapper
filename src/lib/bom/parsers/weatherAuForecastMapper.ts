import { forecastPeriodSchema } from '../types'
import type { ForecastLocation } from '../types'
import type { WeatherApiDailyForecast, WeatherApiEnvelope } from '../weather-au'

function addDay(dateString: string) {
  const date = new Date(dateString)
  date.setUTCDate(date.getUTCDate() + 1)

  return date.toISOString()
}

function formatRainRange(forecast: WeatherApiDailyForecast) {
  const amount = forecast.rain?.amount

  if (!amount || amount.max === null) {
    return null
  }

  const min = amount.min ?? 0

  if (amount.max === min) {
    return `${min} ${amount.units}`
  }

  return `${min} to ${amount.max} ${amount.units}`
}

export function mapWeatherApiDailyForecastsToPeriods(
  response: WeatherApiEnvelope<Array<WeatherApiDailyForecast>>,
  location: ForecastLocation,
) {
  return response.data.map((forecast) =>
    forecastPeriodSchema.parse({
      locationId: location.id,
      date: forecast.date.slice(0, 10),
      startTimeLocal: forecast.date,
      endTimeLocal: addDay(forecast.date),
      precis: forecast.short_text ?? 'Forecast unavailable.',
      detailedText: forecast.extended_text ?? null,
      minTempC: forecast.temp_min ?? null,
      maxTempC: forecast.temp_max ?? null,
      precipitationProbabilityPct: forecast.rain?.chance ?? null,
      precipitationRange: formatRainRange(forecast),
      source: {
        dataset: 'BOM Weather API daily forecasts',
        provider: 'weather-api',
        channel: 'http',
        status: 'ok',
        productId: location.forecastProductId,
        note: 'Live daily forecast sourced from the BOM Weather API family referenced by weather-au.',
        fetchedAt: response.metadata.response_timestamp,
        issuedAt: response.metadata.issue_time,
      },
    }),
  )
}
