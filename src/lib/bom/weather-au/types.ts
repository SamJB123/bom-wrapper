export type WeatherAuState =
  | 'ACT'
  | 'NSW'
  | 'NT'
  | 'QLD'
  | 'SA'
  | 'TAS'
  | 'VIC'
  | 'WA'

export type WeatherAuFetcher = (
  input: string,
  init?: RequestInit,
) => Promise<Response>

export type WeatherApiMetadata = {
  response_timestamp: string
  copyright: string
  issue_time?: string
  observation_time?: string
}

export type WeatherApiEnvelope<TData> = {
  metadata: WeatherApiMetadata
  data: TData
}

export type WeatherApiSearchResult = {
  geohash: string
  id: string
  name: string
  postcode?: string
  state: string
}

export type WeatherApiLocation = {
  geohash: string
  timezone: string
  latitude: number
  longitude: number
  marine_area_id?: string
  tidal_point?: string
  has_wave?: boolean
  id: string
  name: string
  state: string
}

export type WeatherApiWarningSummary = {
  id: string
  state: string
  expiry_time?: string
  issue_time?: string
  type: string
  short_title: string
  warning_group_type?: string
  phase?: string
}

export type WeatherApiWarningDetail = {
  id: string
  type: string
  title: string
  short_title: string
  state: string
  message: string
  issue_time?: string
  expiry_time?: string
  phase?: string
}

export type WeatherApiObservation = {
  temp: number
  temp_feels_like?: number
  wind?: {
    speed_kilometre?: number
    speed_knot?: number
    direction?: string
    gust_speed_knot?: number
    gust_speed_kilometre?: number
  }
  gust?: {
    speed_kilometre?: number
    speed_knot?: number
  }
  max_gust?: {
    speed_kilometre?: number
    speed_knot?: number
    time?: string
  }
  max_temp?: {
    time?: string
    value?: number
  }
  min_temp?: {
    time?: string
    value?: number
  }
  rain_since_9am?: number
  humidity?: number
  station?: {
    bom_id?: string
    name?: string
    distance?: number
  }
  dew_point?: number
  relative_humidity?: number
  uv?: number
}

export type WeatherApiRainAmount = {
  min: number | null
  max: number | null
  units: string
  lower_range?: number | null
  upper_range?: number | null
}

export type WeatherApiRainForecast = {
  amount: WeatherApiRainAmount
  chance: number
  start_time?: string
  period?: string
}

export type WeatherApiDailyForecast = {
  rain?: {
    amount?: WeatherApiRainAmount
    chance?: number
    chance_of_no_rain_category?: string
    precipitation_amount_25_percent_chance?: number
    precipitation_amount_50_percent_chance?: number
    precipitation_amount_75_percent_chance?: number
  }
  uv?: {
    category?: string
    end_time?: string
    max_index?: number
    start_time?: string
  }
  astronomical?: {
    sunrise_time?: string
    sunset_time?: string
  }
  date: string
  temp_max?: number | null
  temp_min?: number | null
  extended_text?: string
  icon_descriptor?: string
  short_text?: string
  surf_danger?: string | null
  fire_danger?: string | null
  fire_danger_category?: {
    text?: string
    default_colour?: string
    dark_mode_colour?: string
  }
  now?: {
    is_night?: boolean
    now_label?: string
    later_label?: string
    temp_now?: number | null
    temp_later?: number | null
  }
}

export type WeatherApiHourlyForecast = {
  rain?: {
    amount?: WeatherApiRainAmount
    chance?: number
    precipitation_amount_10_percent_chance?: number
    precipitation_amount_25_percent_chance?: number
    precipitation_amount_50_percent_chance?: number
  }
  temp?: number | null
  temp_feels_like?: number | null
  dew_point?: number | null
  wind?: {
    speed_knot?: number
    speed_kilometre?: number
    direction?: string
    gust_speed_knot?: number
    gust_speed_kilometre?: number
  }
  relative_humidity?: number | null
  uv?: number | null
  icon_descriptor?: string
  next_three_hourly_forecast_period?: string
  time: string
  is_night?: boolean
  next_forecast_period?: string
}

export type ObservationStationAttributes = Record<string, string>

export type PlaceForecast = {
  issued: string
  date?: string
  min?: string
  max?: string
  precis?: string
}

export type SummaryItem = {
  label: string
  value: string | number | null
  unit: string
}

export type SummaryResult = {
  location: SummaryItem
  current_temp: SummaryItem
  precis: SummaryItem
  temp_now: SummaryItem
  temp_later: SummaryItem
  temp_feels_like: SummaryItem
  chance_of_rain: SummaryItem
  possible_rainfall?: SummaryItem
}
