import { z } from 'zod'
import { getLocationWarnings } from '~/lib/bom/services/warningService'
import { locationWarningsResponseSchema } from '~/lib/bom/types'
import { api, withBomErrorHandling } from '../base'

const warningInputSchema = z.object({
  locationId: z.string().trim().min(1),
})

export const warningsRouter = {
  getByLocation: api
    .route({
      method: 'GET',
      path: '/locations/{locationId}/warnings',
    })
    .input(warningInputSchema)
    .output(locationWarningsResponseSchema)
    .handler(async ({ input }) =>
      withBomErrorHandling(() => getLocationWarnings(input.locationId)),
    ),
}
