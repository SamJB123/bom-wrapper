import type { WeatherAuState } from './weather-au'

export type LiveLocationMapping = {
  stationId: string
  locationId: string
  geohash: string
  search: string
  placeState: string
  placeSlug: string
  uvState: WeatherAuState
  uvLocationName: string
}

const liveMappings: Array<LiveLocationMapping> = [
  {
    stationId: 'sydney-airport',
    locationId: 'sydney',
    geohash: 'r3gx2e',
    search: '2000',
    placeState: 'nsw',
    placeSlug: 'sydney',
    uvState: 'NSW',
    uvLocationName: 'Sydney',
  },
  {
    stationId: 'canberra-airport',
    locationId: 'canberra',
    geohash: 'r3dp30',
    search: '2601',
    placeState: 'act',
    placeSlug: 'canberra',
    uvState: 'ACT',
    uvLocationName: 'Canberra',
  },
  {
    stationId: 'melbourne-olympic-park',
    locationId: 'melbourne',
    geohash: 'r1r0fu',
    search: '3000',
    placeState: 'vic',
    placeSlug: 'melbourne',
    uvState: 'VIC',
    uvLocationName: 'Melbourne',
  },
  {
    stationId: 'brisbane-airport',
    locationId: 'brisbane',
    geohash: 'r7hgdm',
    search: '4000',
    placeState: 'qld',
    placeSlug: 'brisbane',
    uvState: 'QLD',
    uvLocationName: 'Brisbane',
  },
  {
    stationId: 'adelaide-airport',
    locationId: 'adelaide',
    geohash: 'r1f93c',
    search: '5000',
    placeState: 'sa',
    placeSlug: 'adelaide',
    uvState: 'SA',
    uvLocationName: 'Adelaide',
  },
  {
    stationId: 'perth-airport',
    locationId: 'perth',
    geohash: 'qd66hr',
    search: '6000',
    placeState: 'wa',
    placeSlug: 'perth',
    uvState: 'WA',
    uvLocationName: 'Perth',
  },
  {
    stationId: 'hobart-airport',
    locationId: 'hobart',
    geohash: 'r22u07',
    search: '7000',
    placeState: 'tas',
    placeSlug: 'hobart',
    uvState: 'TAS',
    uvLocationName: 'Hobart',
  },
  {
    stationId: 'darwin-airport',
    locationId: 'darwin',
    geohash: 'qvv117',
    search: '0800',
    placeState: 'nt',
    placeSlug: 'darwin',
    uvState: 'NT',
    uvLocationName: 'Darwin',
  },
]

export const weatherApiLocationPrefix = 'weather-api:'

export function isDynamicWeatherApiLocationId(locationId: string) {
  return locationId.startsWith(weatherApiLocationPrefix)
}

export function toDynamicWeatherApiLocationId(geohash: string) {
  return `${weatherApiLocationPrefix}${geohash.slice(0, 6)}`
}

export function getDynamicWeatherApiGeohash(locationId: string) {
  return isDynamicWeatherApiLocationId(locationId)
    ? locationId.slice(weatherApiLocationPrefix.length)
    : null
}

export function listLiveMappings() {
  return liveMappings
}

export function getLiveMappingByStationId(stationId: string) {
  return liveMappings.find((mapping) => mapping.stationId === stationId) ?? null
}

export function getLiveMappingByLocationId(locationId: string) {
  return liveMappings.find((mapping) => mapping.locationId === locationId) ?? null
}
