import { useMemo } from 'react'
import type { AustraliaOverviewResponse } from '~/lib/bom/types'
import { metricToColor, type GlobeMetric } from './colorScales'
import { valueToMarkerScale } from './markerTransforms'

export type GlobeMarkerView = AustraliaOverviewResponse['markers'][number] & {
  metricValue: number | null
  metricLabel: string
  color: string
  scale: number
}

function getMetricValue(
  metric: GlobeMetric,
  marker: AustraliaOverviewResponse['markers'][number],
) {
  if (metric === 'temperature') {
    return marker.observation.airTemperatureC
  }

  if (metric === 'wind') {
    return marker.observation.windSpeedKmh
  }

  return marker.forecastSummary.precipitationProbabilityPct
}

function getMetricLabel(metric: GlobeMetric, value: number | null) {
  if (metric === 'temperature') {
    return value === null ? 'No reading' : `${value.toFixed(1)}°C`
  }

  if (metric === 'wind') {
    return value === null ? 'No reading' : `${value.toFixed(0)} km/h`
  }

  return value === null ? 'No reading' : `${value.toFixed(0)}% chance`
}

export function useGlobeData(
  overview: AustraliaOverviewResponse,
  metric: GlobeMetric,
) {
  return useMemo(() => {
    return overview.markers.map((marker) => {
      const metricValue = getMetricValue(metric, marker)

      return {
        ...marker,
        metricValue,
        metricLabel: getMetricLabel(metric, metricValue),
        color: metricToColor(metric, metricValue),
        scale: valueToMarkerScale(metricValue),
      }
    })
  }, [metric, overview])
}
