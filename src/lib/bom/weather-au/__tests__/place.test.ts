import { describe, expect, it } from 'vitest'
import { placeHtmlFixture } from '~/test/fixtures/weatherAu'
import { Place } from '../place'

describe('Place', () => {
  it('extracts current air temperature, forecast, and station id', async () => {
    const place = await Place.create({
      state: 'vic',
      location: 'parkville',
      html: placeHtmlFixture,
    })

    expect(place.airTemperature()).toBe(17.6)
    expect(place.stationId()).toBe('95936')
    expect(place.forecast()).toEqual({
      issued: '4:20 pm AEDT on Thursday 12 March 2026',
      date: 'Thursday 12 March',
      min: '13',
      max: '19',
      precis: 'Shower or two.',
    })
  })
})
