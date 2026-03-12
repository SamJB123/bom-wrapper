import { describe, expect, it } from 'vitest'
import { WeatherApi } from '../api'
import { WeatherAuParseError } from '../errors'
import { parseWeatherApiDailyForecastResponse } from '../parsers/weatherApi'
import {
  weatherApiDailyForecastFixture,
  weatherApiHourlyForecastFixture,
  weatherApiLocationFixture,
  weatherApiObservationFixture,
  weatherApiRain404Fixture,
  weatherApiSearchEmptyFixture,
  weatherApiSearchParkvilleFixture,
  weatherApiWarningDetailFixture,
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

function createMockFetcher() {
  return async (input: string) => {
    if (input.includes('locations?search=parkville%2Bvic')) {
      return createJsonResponse(weatherApiSearchEmptyFixture)
    }

    if (input.includes('locations?search=parkville%20vic')) {
      return createJsonResponse(weatherApiSearchEmptyFixture)
    }

    if (input.includes('locations?search=parkville')) {
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

    if (input.endsWith('/warnings/NSW_MW004_IDN20400')) {
      return createJsonResponse(weatherApiWarningDetailFixture)
    }

    return createJsonResponse({}, 500)
  }
}

describe('WeatherApi', () => {
  it('searches, falls back, and stores a 6 character geohash', async () => {
    const api = await WeatherApi.create({
      search: 'parkville+vic',
      fetcher: createMockFetcher(),
    })

    expect(api.geohash).toBe('r1r143')
    expect(api.toString()).toContain("geohash='r1r143'")
  })

  it('returns location, observations, forecasts, warnings, and null rain on 404', async () => {
    const api = new WeatherApi({
      geohash: 'r1r143n',
      fetcher: createMockFetcher(),
    })

    const [location, observations, rain, daily, hourly, warnings, warning] =
      await Promise.all([
        api.location(),
        api.observations(),
        api.forecastRain(),
        api.forecastsDaily(),
        api.forecastsHourly(),
        api.warnings(),
        api.warning('NSW_MW004_IDN20400'),
      ])

    expect(location?.name).toBe('Parkville')
    expect(observations?.station?.bom_id).toBe('086338')
    expect(rain).toBeNull()
    expect(daily?.length).toBe(2)
    expect(hourly?.[0]?.wind?.direction).toBe('SW')
    expect(warnings?.[0]?.id).toBe('NSW_MW004_IDN20400')
    expect(warning?.title).toContain('Marine Wind Warning')
  })

  it('includes response and expected shape in parse diagnostics', () => {
    expect(() =>
      parseWeatherApiDailyForecastResponse({
        data: [
          {
            date: null,
          },
        ],
      }),
    ).toThrowError(WeatherAuParseError)

    try {
      parseWeatherApiDailyForecastResponse({
        data: [
          {
            date: null,
          },
        ],
      })
    } catch (error) {
      expect(error).toBeInstanceOf(WeatherAuParseError)

      const parseError = error as WeatherAuParseError

      expect(parseError.details?.response).toContain('"date": null')
      expect(parseError.details?.expectedShape).toMatchObject({
        data: expect.any(Array),
      })
      expect(parseError.details?.validationErrors).toBeTruthy()
    }
  })
})
