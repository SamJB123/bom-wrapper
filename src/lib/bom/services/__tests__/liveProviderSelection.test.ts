import { afterEach, describe, expect, it } from 'vitest'
import { clearBomCache } from '~/lib/bom/cache'
import { getHealthStatus, getSourceList } from '../sourceStatusService'

const originalBomDataMode = process.env.BOM_DATA_MODE
const originalBomLiveProvider = process.env.BOM_LIVE_PROVIDER

describe('live provider selection', () => {
  afterEach(() => {
    clearBomCache()
    process.env.BOM_DATA_MODE = originalBomDataMode
    process.env.BOM_LIVE_PROVIDER = originalBomLiveProvider
  })

  it('reports weather-api as the active provider in live mode', async () => {
    process.env.BOM_DATA_MODE = 'live'
    process.env.BOM_LIVE_PROVIDER = 'weather-api'

    const [health, sources] = await Promise.all([
      getHealthStatus(),
      getSourceList(),
    ])

    expect(health.provider).toBe('weather-api')
    expect(
      sources.items.find((item) => item.id === 'observations')?.activeProvider,
    ).toBe('weather-api')
    expect(
      sources.items.find((item) => item.id === 'forecasts')?.activeProvider,
    ).toBe('weather-api')
  })
})
