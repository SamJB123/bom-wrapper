import { z } from 'zod'
import { getForecast } from '~/lib/bom/services/forecastService'
import { forecastResponseSchema } from '~/lib/bom/types'
import { api, withBomErrorHandling } from '../base'

const forecastInputSchema = z.object({
  locationId: z.string().trim().min(1),
})

export const forecastsRouter = {
  getByLocation: api
    .route({
      method: 'GET',
      path: '/forecasts/{locationId}',
    })
    .input(forecastInputSchema)
    .output(forecastResponseSchema)
    .handler(async ({ input }) =>
      withBomErrorHandling(() => getForecast(input.locationId)),
    ),
}
