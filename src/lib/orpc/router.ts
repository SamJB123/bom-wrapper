import { api } from './base'
import { forecastsRouter } from './routers/forecasts'
import { healthRouter } from './routers/health'
import { locationsRouter } from './routers/locations'
import { observationsRouter } from './routers/observations'
import { overviewRouter } from './routers/overview'
import { summaryRouter } from './routers/summary'
import { sourcesRouter } from './routers/sources'
import { uvRouter } from './routers/uv'
import { warningsRouter } from './routers/warnings'

export const apiRouter = api.prefix('/v1').router({
  health: healthRouter,
  sources: sourcesRouter,
  locations: locationsRouter,
  observations: observationsRouter,
  forecasts: forecastsRouter,
  overview: overviewRouter,
  warnings: warningsRouter,
  uv: uvRouter,
  summary: summaryRouter,
})
