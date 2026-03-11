import { describe, expect, it } from 'vitest'
import observationActNsw from '~/test/fixtures/bom/observations/IDN60901.json'
import { stationMetadataFixture } from '~/test/fixtures/bom/metadata'
import { parseObservationSnapshot } from '../observationParser'
import { parseStationMetadata } from '../stationParser'

describe('parseObservationSnapshot', () => {
  it('normalizes a BOM-style observation payload for a known station', () => {
    const station = parseStationMetadata(stationMetadataFixture).find(
      (entry) => entry.id === 'sydney-airport',
    )

    if (!station) {
      throw new Error('Expected Sydney station metadata fixture')
    }

    const snapshot = parseObservationSnapshot(observationActNsw, station)

    expect(snapshot.stationId).toBe('sydney-airport')
    expect(snapshot.stationName).toBe('Sydney Airport')
    expect(snapshot.airTemperatureC).toBeCloseTo(26.4, 1)
    expect(snapshot.windSpeedKmh).toBe(17)
    expect(snapshot.source.productId).toBe('IDN60901')
  })
})
