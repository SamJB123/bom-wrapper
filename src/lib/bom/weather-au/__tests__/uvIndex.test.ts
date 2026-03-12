import { describe, expect, it } from 'vitest'
import { uvIndexXmlFixture } from '~/test/fixtures/weatherAu'
import { UvIndex } from '../uvIndex'

describe('UvIndex', () => {
  it('lists AAC locations and extracts UV messages', async () => {
    const uvIndex = await UvIndex.create({
      state: 'VIC',
      xml: uvIndexXmlFixture,
    })

    expect(uvIndex.identifier).toBe('IDZ00112')
    expect(uvIndex.getAac('Melbourne')).toBe('VIC_PT042')
    expect(uvIndex.uvMessage('VIC_PT042')).toContain('Sun protection')
    expect(Object.keys(uvIndex.aacList()).length).toBe(2)
  })
})
