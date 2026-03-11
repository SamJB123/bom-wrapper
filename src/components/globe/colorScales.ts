export type GlobeMetric = 'temperature' | 'wind' | 'rain'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function mixChannel(start: number, end: number, ratio: number) {
  return Math.round(start + (end - start) * ratio)
}

function toRgbString(red: number, green: number, blue: number) {
  return `rgb(${red}, ${green}, ${blue})`
}

function createGradientColor(
  value: number,
  min: number,
  max: number,
  start: [number, number, number],
  end: [number, number, number],
) {
  const ratio = clamp((value - min) / (max - min || 1), 0, 1)

  return toRgbString(
    mixChannel(start[0], end[0], ratio),
    mixChannel(start[1], end[1], ratio),
    mixChannel(start[2], end[2], ratio),
  )
}

export function metricToColor(metric: GlobeMetric, value: number | null) {
  if (value === null) {
    return 'rgb(148, 163, 184)'
  }

  if (metric === 'temperature') {
    return createGradientColor(value, 8, 36, [56, 189, 248], [251, 146, 60])
  }

  if (metric === 'wind') {
    return createGradientColor(value, 0, 50, [34, 197, 94], [168, 85, 247])
  }

  return createGradientColor(value, 0, 100, [125, 211, 252], [16, 185, 129])
}
