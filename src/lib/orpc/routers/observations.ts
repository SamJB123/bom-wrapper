import { z } from 'zod'
import {
  getObservation,
  getStation,
  listStations,
} from '~/lib/bom/services/observationService'
import {
  observationSnapshotSchema,
  observationStationSchema,
  stationListResponseSchema,
} from '~/lib/bom/types'
import { api, withBomErrorHandling } from '../base'

const stationInputSchema = z.object({
  stationId: z.string().trim().min(1),
})

export const observationsRouter = {
  listStations: api
    .route({
      method: 'GET',
      path: '/stations',
    })
    .output(stationListResponseSchema)
    .handler(async () => withBomErrorHandling(() => listStations())),
  getStation: api
    .route({
      method: 'GET',
      path: '/stations/{stationId}',
    })
    .input(stationInputSchema)
    .output(observationStationSchema)
    .handler(async ({ input }) =>
      withBomErrorHandling(() => getStation(input.stationId)),
    ),
  getStationObservation: api
    .route({
      method: 'GET',
      path: '/stations/{stationId}/observation',
    })
    .input(stationInputSchema)
    .output(observationSnapshotSchema)
    .handler(async ({ input }) =>
      withBomErrorHandling(() => getObservation(input.stationId)),
    ),
}
