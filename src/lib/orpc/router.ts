import { api } from './base'
import { forecastsRouter } from './routers/forecasts'
import { healthRouter } from './routers/health'
import { locationsRouter } from './routers/locations'
import { observationsRouter } from './routers/observations'
import { overviewRouter } from './routers/overview'
import { sourcesRouter } from './routers/sources'

export const apiRouter = api.prefix('/v1').router({
  health: healthRouter,
  sources: sourcesRouter,
  locations: locationsRouter,
  observations: observationsRouter,
  forecasts: forecastsRouter,
  overview: overviewRouter,
})
