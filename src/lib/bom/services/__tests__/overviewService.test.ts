import { beforeEach, describe, expect, it } from 'vitest'
import { clearBomCache } from '~/lib/bom/cache'
import { getAustraliaOverview } from '../overviewService'

describe('getAustraliaOverview', () => {
  beforeEach(() => {
    clearBomCache()
  })

  it('returns an Australia-wide marker collection for the globe', async () => {
    const overview = await getAustraliaOverview()

    expect(overview.dataMode).toBe('fixture')
    expect(overview.markers).toHaveLength(8)
    expect(overview.markers[0]?.observation.stationId).toBeTruthy()
    expect(overview.markers[0]?.forecastSummary.precis).toBeTruthy()
  })
})
