import { describe, expect, it } from 'vitest'
import { forecastFixtures } from '~/test/fixtures/bom/forecasts'
import { pointPlaceMetadataFixture } from '~/test/fixtures/bom/metadata'
import { parseForecastPeriods } from '../forecastParser'
import { parsePointPlaceMetadata } from '../pointPlaceParser'

describe('parseForecastPeriods', () => {
  it('extracts daily forecast periods for a known location', () => {
    const location = parsePointPlaceMetadata(pointPlaceMetadataFixture).find(
      (entry) => entry.id === 'brisbane',
    )

    if (!location) {
      throw new Error('Expected Brisbane point-place metadata fixture')
    }

    const periods = parseForecastPeriods(forecastFixtures.IDQ10605, location)

    expect(periods).toHaveLength(2)
    expect(periods[0]?.locationId).toBe('brisbane')
    expect(periods[0]?.precis).toContain('Possible storm')
    expect(periods[0]?.precipitationProbabilityPct).toBe(70)
  })
})
