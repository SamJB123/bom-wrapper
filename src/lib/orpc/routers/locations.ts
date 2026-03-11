import { z } from 'zod'
import { searchLocations } from '~/lib/bom/services/locationIndex'
import { locationSearchResponseSchema } from '~/lib/bom/types'
import { api, withBomErrorHandling } from '../base'

const searchLocationsInputSchema = z.object({
  q: z.string().trim().optional(),
  kind: z.enum(['station', 'forecast-location']).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export const locationsRouter = {
  search: api
    .route({
      method: 'GET',
      path: '/locations/search',
    })
    .input(searchLocationsInputSchema)
    .output(locationSearchResponseSchema)
    .handler(async ({ input }) => withBomErrorHandling(() => searchLocations(input))),
}
