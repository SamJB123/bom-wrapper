import observationActNsw from '~/test/fixtures/bom/observations/IDN60901.json'
import observationNt from '~/test/fixtures/bom/observations/IDD60901.json'
import observationQld from '~/test/fixtures/bom/observations/IDQ60901.json'
import observationSa from '~/test/fixtures/bom/observations/IDS60901.json'
import observationTas from '~/test/fixtures/bom/observations/IDT60901.json'
import observationVic from '~/test/fixtures/bom/observations/IDV60901.json'
import observationWa from '~/test/fixtures/bom/observations/IDW60901.json'
import { withCache } from '../cache'
import { unsupportedLiveSource } from '../errors'
import { fetchUpstreamText } from '../http'
import { getBomDataMode } from '../mode'
import { buildObservationUrl } from '../source-config'
import type { ObservationStation } from '../types'

const observationFixtures = new Map<string, unknown>([
  ['IDN60901', observationActNsw],
  ['IDD60901', observationNt],
  ['IDQ60901', observationQld],
  ['IDS60901', observationSa],
  ['IDT60901', observationTas],
  ['IDV60901', observationVic],
  ['IDW60901', observationWa],
])

export async function loadRawObservationPayload(station: ObservationStation) {
  const mode = getBomDataMode()
  const cacheKey = `bom:observation:${mode}:${station.observationProductId}`

  return withCache(cacheKey, 1000 * 60 * 5, async () => {
    if (mode === 'fixture') {
      const fixture = observationFixtures.get(station.observationProductId)

      if (!fixture) {
        throw unsupportedLiveSource(
          `No observation fixture exists for ${station.observationProductId}`,
        )
      }

      return fixture
    }

    const url = buildObservationUrl(station.observationProductId, station.wmoId)
    const rawText = await fetchUpstreamText(url)

    return JSON.parse(rawText) as unknown
  })
}
