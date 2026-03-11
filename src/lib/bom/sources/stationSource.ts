import { stationMetadataFixture } from '~/test/fixtures/bom/metadata'
import { withCache } from '../cache'
import { parseStationMetadata } from '../parsers/stationParser'

const STATION_METADATA_CACHE_KEY = 'bom:stations'

export function listStationMetadata() {
  return withCache(STATION_METADATA_CACHE_KEY, 1000 * 60 * 60, async () => {
    return parseStationMetadata(stationMetadataFixture)
  })
}
