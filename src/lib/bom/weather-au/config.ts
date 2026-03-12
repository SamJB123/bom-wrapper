import type { WeatherAuState } from './types'

export const WEATHER_API_BASE_URL = 'https://api.weather.bom.gov.au/v1'

export const WEATHER_API_ACKNOWLEDGMENT =
  'Data courtesy of the Australian Bureau of Meteorology (https://api.weather.bom.gov.au)'

export const WEATHER_AU_PLACE_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'

export const OBSERVATION_XML_PRODUCT_URLS: Record<WeatherAuState, string> = {
  ACT: 'https://reg.bom.gov.au/fwo/IDN60920.xml',
  NSW: 'https://reg.bom.gov.au/fwo/IDN60920.xml',
  NT: 'https://reg.bom.gov.au/fwo/IDD60920.xml',
  QLD: 'https://reg.bom.gov.au/fwo/IDQ60920.xml',
  SA: 'https://reg.bom.gov.au/fwo/IDS60920.xml',
  TAS: 'https://reg.bom.gov.au/fwo/IDT60920.xml',
  VIC: 'https://reg.bom.gov.au/fwo/IDV60920.xml',
  WA: 'https://reg.bom.gov.au/fwo/IDW60920.xml',
}

export const UV_INDEX_PRODUCT_URLS: Record<WeatherAuState, string> = {
  ACT: 'https://reg.bom.gov.au/fwo/IDZ00107.xml',
  NSW: 'https://reg.bom.gov.au/fwo/IDZ00107.xml',
  NT: 'https://reg.bom.gov.au/fwo/IDZ00108.xml',
  QLD: 'https://reg.bom.gov.au/fwo/IDZ00109.xml',
  SA: 'https://reg.bom.gov.au/fwo/IDZ00110.xml',
  TAS: 'https://reg.bom.gov.au/fwo/IDZ00111.xml',
  VIC: 'https://reg.bom.gov.au/fwo/IDZ00112.xml',
  WA: 'https://reg.bom.gov.au/fwo/IDZ00113.xml',
}

export function buildPlaceUrl(state: string, location: string) {
  return `https://www.bom.gov.au/places/${state.toLowerCase()}/${location.toLowerCase()}/`
}

export function buildWeatherApiLocationSearchUrl(search: string) {
  return `${WEATHER_API_BASE_URL}/locations?search=${encodeURIComponent(search)}`
}

export function buildWeatherApiLocationUrl(geohash: string) {
  return `${WEATHER_API_BASE_URL}/locations/${geohash}`
}

export function buildWeatherApiLocationEndpointUrl(
  geohash: string,
  endpoint: string,
) {
  return `${WEATHER_API_BASE_URL}/locations/${geohash}/${endpoint}`
}

export function buildWeatherApiWarningUrl(id: string) {
  return `${WEATHER_API_BASE_URL}/warnings/${id}`
}
