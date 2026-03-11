import { healthResponseSchema } from '~/lib/bom/types'
import { getHealthStatus } from '~/lib/bom/services/sourceStatusService'
import { api, withBomErrorHandling } from '../base'

export const healthRouter = {
  status: api
    .route({
      method: 'GET',
      path: '/health',
    })
    .output(healthResponseSchema)
    .handler(async () => withBomErrorHandling(() => getHealthStatus())),
}
