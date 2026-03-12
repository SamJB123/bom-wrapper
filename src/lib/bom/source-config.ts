const observationProductsByState = {
  ACT: 'IDN60901',
  NSW: 'IDN60901',
  NT: 'IDD60901',
  QLD: 'IDQ60901',
  SA: 'IDS60901',
  TAS: 'IDT60901',
  VIC: 'IDV60901',
  WA: 'IDW60901',
} as const

const forecastProductsByState = {
  ACT: 'IDN11050',
  NSW: 'IDN11050',
  NT: 'IDD10198',
  QLD: 'IDQ10605',
  SA: 'IDS10037',
  TAS: 'IDT16700',
  VIC: 'IDV10753',
  WA: 'IDW14199',
} as const

export const curatedStates = Object.keys(observationProductsByState)

export function getObservationProductId(state: string) {
  const normalizedState = state.toUpperCase() as keyof typeof observationProductsByState

  return observationProductsByState[normalizedState]
}

export function getForecastProductId(state: string) {
  const normalizedState = state.toUpperCase() as keyof typeof forecastProductsByState

  return forecastProductsByState[normalizedState]
}

export function buildObservationUrl(productId: string, wmoId: string) {
  return `https://www.bom.gov.au/fwo/${productId}/${productId}.${wmoId}.json`
}

export function buildForecastUrl(productId: string) {
  const viteForecastBaseUrl =
    typeof import.meta !== 'undefined' &&
    typeof import.meta.env !== 'undefined'
      ? import.meta.env.VITE_BOM_FORECAST_BASE_URL
      : undefined

  const overrideBaseUrl =
    viteForecastBaseUrl ||
    (typeof process !== 'undefined' ? process.env.BOM_FORECAST_BASE_URL : '')

  if (!overrideBaseUrl) {
    return null
  }

  return `${overrideBaseUrl.replace(/\/$/, '')}/${productId}.xml`
}

export const bomAttribution = {
  provider: 'Bureau of Meteorology' as const,
  notice:
    'Weather data is derived from Bureau of Meteorology products and should be attributed to the Bureau of Meteorology.',
  usage:
    'This demo uses curated fixtures by default because automated access is blocked in this environment and some Bureau products have redistribution constraints.',
  moreInfoUrl: 'https://www.bom.gov.au/other/copyright.shtml',
}
