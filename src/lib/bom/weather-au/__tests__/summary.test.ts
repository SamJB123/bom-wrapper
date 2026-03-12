import { describe, expect, it } from 'vitest'
import { Summary } from '../summary'
import {
  weatherApiDailyForecastFixture,
  weatherApiHourlyForecastFixture,
  weatherApiLocationFixture,
  weatherApiObservationFixture,
  weatherApiRain404Fixture,
  weatherApiSearchParkvilleFixture,
  weatherApiWarningSummaryFixture,
} from '~/test/fixtures/weatherAu'

function createJsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

function createSummaryMockFetcher() {
  return async (input: string) => {
    if (input.includes('locations?search=3052')) {
      return createJsonResponse(weatherApiSearchParkvilleFixture)
    }

    if (input.endsWith('/locations/r1r143')) {
      return createJsonResponse(weatherApiLocationFixture)
    }

    if (input.endsWith('/locations/r1r143/observations')) {
      return createJsonResponse(weatherApiObservationFixture)
    }

    if (input.endsWith('/locations/r1r143/forecast/rain')) {
      return createJsonResponse(weatherApiRain404Fixture, 404)
    }

    if (input.endsWith('/locations/r1r143/forecasts/daily')) {
      return createJsonResponse(weatherApiDailyForecastFixture)
    }

    if (input.endsWith('/locations/r1r143/forecasts/hourly')) {
      return createJsonResponse(weatherApiHourlyForecastFixture)
    }

    if (input.endsWith('/locations/r1r143/warnings')) {
      return createJsonResponse(weatherApiWarningSummaryFixture)
    }

    return createJsonResponse({}, 500)
  }
}

describe('Summary', () => {
  it('aggregates weather API responses into a compact summary', async () => {
    const summary = await Summary.create({
      search: '3052',
      fetcher: createSummaryMockFetcher(),
    })

    const result = summary.summary()

    expect(result?.location.value).toBe('Parkville, VIC')
    expect(result?.current_temp.value).toBe(17)
    expect(result?.chance_of_rain.value).toBe(60)
    expect(summary.summaryText()).toContain('Current Temp')
    expect(summary.today()?.extended_text).toContain('Cloudy')
  })
})
