import { getSourceList } from '~/lib/bom/services/sourceStatusService'
import { sourceListResponseSchema } from '~/lib/bom/types'
import { api, withBomErrorHandling } from '../base'

export const sourcesRouter = {
  list: api
    .route({
      method: 'GET',
      path: '/sources',
    })
    .output(sourceListResponseSchema)
    .handler(async () => withBomErrorHandling(() => getSourceList())),
}
