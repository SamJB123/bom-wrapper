import { z } from 'zod'
import { getLocationSummary } from '~/lib/bom/services/summaryService'
import { locationSummaryResponseSchema } from '~/lib/bom/types'
import { api, withBomErrorHandling } from '../base'

const summaryInputSchema = z.object({
  locationId: z.string().trim().min(1),
})

export const summaryRouter = {
  getByLocation: api
    .route({
      method: 'GET',
      path: '/locations/{locationId}/summary',
    })
    .input(summaryInputSchema)
    .output(locationSummaryResponseSchema)
    .handler(async ({ input }) =>
      withBomErrorHandling(() => getLocationSummary(input.locationId)),
    ),
}
