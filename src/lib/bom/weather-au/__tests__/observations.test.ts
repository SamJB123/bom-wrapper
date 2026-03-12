import { describe, expect, it } from 'vitest'
import { observationXmlFixture } from '~/test/fixtures/weatherAu'
import { Observations } from '../observations'

describe('Observations', () => {
  it('parses station lists and station helpers from XML', async () => {
    const observations = await Observations.create({
      state: 'VIC',
      xml: observationXmlFixture,
    })

    expect(observations.identifier).toBe('IDV60920')
    expect(observations.stations().length).toBe(2)
    expect(observations.stationAttribute('95936', 'description')).toBe(
      'Melbourne (Olympic Park)',
    )
    expect(observations.periodAttribute('95936', 'time-local')).toBe(
      '2026-03-12T11:30:00+11:00',
    )
    expect(observations.airTemperature('95936')).toBe('17.1')
    expect(observations.rainfall('94866')).toBe('0.0')
  })
})
