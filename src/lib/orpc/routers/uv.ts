import { z } from 'zod'
import { getLocationUv } from '~/lib/bom/services/uvService'
import { uvResponseSchema } from '~/lib/bom/types'
import { api, withBomErrorHandling } from '../base'

const uvInputSchema = z.object({
  locationId: z.string().trim().min(1),
})

export const uvRouter = {
  getByLocation: api
    .route({
      method: 'GET',
      path: '/locations/{locationId}/uv',
    })
    .input(uvInputSchema)
    .output(uvResponseSchema)
    .handler(async ({ input }) =>
      withBomErrorHandling(() => getLocationUv(input.locationId)),
    ),
}
