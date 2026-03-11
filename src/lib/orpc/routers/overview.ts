import { getAustraliaOverview } from '~/lib/bom/services/overviewService'
import { australiaOverviewResponseSchema } from '~/lib/bom/types'
import { api, withBomErrorHandling } from '../base'

export const overviewRouter = {
  australia: api
    .route({
      method: 'GET',
      path: '/overview/australia',
    })
    .output(australiaOverviewResponseSchema)
    .handler(async () => withBomErrorHandling(() => getAustraliaOverview())),
}
