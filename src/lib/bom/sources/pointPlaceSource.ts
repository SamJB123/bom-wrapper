import { pointPlaceMetadataFixture } from '~/test/fixtures/bom/metadata'
import { withCache } from '../cache'
import { parsePointPlaceMetadata } from '../parsers/pointPlaceParser'

const POINT_PLACE_METADATA_CACHE_KEY = 'bom:point-places'

export function listPointPlaceMetadata() {
  return withCache(
    POINT_PLACE_METADATA_CACHE_KEY,
    1000 * 60 * 60,
    async () => parsePointPlaceMetadata(pointPlaceMetadataFixture),
  )
}
