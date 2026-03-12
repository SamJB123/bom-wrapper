export const weatherApiSearchParkvilleFixture = {
  metadata: {
    response_timestamp: '2026-03-12T00:32:59Z',
    copyright:
      'This application programming interface (API) is owned by the Bureau of Meteorology. You must not use, copy or share it. Find out more about our data services at https://www.bom.gov.au/resources/data-services.',
  },
  data: [
    {
      geohash: 'r1r143n',
      id: 'Parkville-r1r143n',
      name: 'Parkville',
      postcode: '3052',
      state: 'VIC',
    },
  ],
} as const

export const weatherApiSearchEmptyFixture = {
  metadata: {
    response_timestamp: '2026-03-12T00:32:59Z',
    copyright:
      'This application programming interface (API) is owned by the Bureau of Meteorology. You must not use, copy or share it. Find out more about our data services at https://www.bom.gov.au/resources/data-services.',
  },
  data: [],
} as const

export const weatherApiLocationFixture = {
  metadata: {
    response_timestamp: '2026-03-12T00:33:00Z',
    copyright:
      'This application programming interface (API) is owned by the Bureau of Meteorology. You must not use, copy or share it. Find out more about our data services at https://www.bom.gov.au/resources/data-services.',
  },
  data: {
    geohash: 'r1r143',
    timezone: 'Australia/Melbourne',
    latitude: -37.78472900390625,
    longitude: 144.9481201171875,
    marine_area_id: 'VIC_MW005',
    tidal_point: 'VIC_TP003',
    has_wave: false,
    id: 'Parkville-r1r143',
    name: 'Parkville',
    state: 'VIC',
  },
} as const

export const weatherApiObservationFixture = {
  metadata: {
    response_timestamp: '2026-03-12T00:33:01Z',
    issue_time: '2026-03-12T00:21:09Z',
    observation_time: '2026-03-12T00:20:00Z',
    copyright:
      'This application programming interface (API) is owned by the Bureau of Meteorology. You must not use, copy or share it. Find out more about our data services at https://www.bom.gov.au/resources/data-services.',
  },
  data: {
    temp: 17,
    temp_feels_like: 14.6,
    wind: {
      speed_kilometre: 11,
      speed_knot: 6,
      direction: 'WSW',
    },
    gust: {
      speed_kilometre: 17,
      speed_knot: 9,
    },
    max_gust: {
      speed_kilometre: 30,
      speed_knot: 16,
      time: '2026-03-12T00:07:00Z',
    },
    max_temp: {
      time: '2026-03-12T00:14:00Z',
      value: 17.2,
    },
    min_temp: {
      time: '2026-03-11T17:32:00Z',
      value: 13.5,
    },
    rain_since_9am: 0,
    humidity: 58,
    station: {
      bom_id: '086338',
      name: 'Melbourne (Olympic Park)',
      distance: 5401,
    },
  },
} as const

export const weatherApiDailyForecastFixture = {
  metadata: {
    response_timestamp: '2026-03-12T00:33:02Z',
    issue_time: '2026-03-12T00:16:03Z',
    copyright:
      'This application programming interface (API) is owned by the Bureau of Meteorology. You must not use, copy or share it. Find out more about our data services at https://www.bom.gov.au/resources/data-services.',
  },
  data: [
    {
      rain: {
        amount: {
          min: 0,
          max: 1,
          lower_range: 0,
          upper_range: 1,
          units: 'mm',
        },
        chance: 60,
        chance_of_no_rain_category: 'medium',
        precipitation_amount_25_percent_chance: 1,
        precipitation_amount_50_percent_chance: 0,
        precipitation_amount_75_percent_chance: 0,
      },
      uv: {
        category: 'veryhigh',
        end_time: '2026-03-12T05:50:00Z',
        max_index: 8,
        start_time: '2026-03-11T23:10:00Z',
      },
      astronomical: {
        sunrise_time: '2026-03-11T20:16:19Z',
        sunset_time: '2026-03-12T08:46:45Z',
      },
      date: '2026-03-11T13:00:00Z',
      temp_max: 19,
      temp_min: 13,
      extended_text:
        'Cloudy. Medium chance of showers. Winds southwesterly 25 to 40 km/h.',
      icon_descriptor: 'shower',
      short_text: 'Shower or two.',
      surf_danger: null,
      fire_danger: 'Moderate',
      fire_danger_category: {
        text: 'Moderate',
        default_colour: '#64bf30',
        dark_mode_colour: '#64bf30',
      },
      now: {
        is_night: false,
        now_label: 'Max',
        later_label: 'Overnight min',
        temp_now: 19,
        temp_later: 14,
      },
    },
    {
      rain: {
        amount: {
          min: 0,
          max: 1,
          lower_range: 0,
          upper_range: 1,
          units: 'mm',
        },
        chance: 30,
        chance_of_no_rain_category: 'high',
        precipitation_amount_25_percent_chance: 1,
        precipitation_amount_50_percent_chance: 0,
        precipitation_amount_75_percent_chance: 0,
      },
      uv: {
        category: 'veryhigh',
        end_time: '2026-03-13T05:50:00Z',
        max_index: 8,
        start_time: '2026-03-12T23:10:00Z',
      },
      astronomical: {
        sunrise_time: '2026-03-12T20:17:16Z',
        sunset_time: '2026-03-13T08:45:15Z',
      },
      date: '2026-03-12T13:00:00Z',
      temp_max: 20,
      temp_min: 14,
      extended_text:
        'Cloudy. Slight chance of a shower in the early morning. Winds southwesterly 20 to 30 km/h tending southerly before dawn then tending southeasterly 15 to 25 km/h in the late evening.',
      icon_descriptor: 'cloudy',
      short_text: 'Cloudy.',
      surf_danger: null,
      fire_danger: 'Moderate',
      fire_danger_category: {
        text: 'Moderate',
        default_colour: '#64bf30',
        dark_mode_colour: '#64bf30',
      },
      now: {
        is_night: false,
        now_label: "Tomorrow's max",
        later_label: "Tomorrow night's min",
        temp_now: 20,
        temp_later: 14,
      },
    },
  ],
} as const

export const weatherApiHourlyForecastFixture = {
  metadata: {
    issue_time: '2026-03-12T00:16:03Z',
    response_timestamp: '2026-03-12T00:33:02Z',
    copyright:
      'This application programming interface (API) is owned by the Bureau of Meteorology. You must not use, copy or share it. Find out more about our data services at https://www.bom.gov.au/resources/data-services.',
  },
  data: [
    {
      rain: {
        amount: { min: 0, max: null, units: 'mm' },
        chance: 20,
        precipitation_amount_10_percent_chance: 1,
        precipitation_amount_25_percent_chance: 0,
        precipitation_amount_50_percent_chance: 0,
      },
      temp: 17,
      temp_feels_like: 11,
      dew_point: 7,
      wind: {
        speed_knot: 14,
        speed_kilometre: 26,
        direction: 'SW',
        gust_speed_knot: 22,
        gust_speed_kilometre: 41,
      },
      relative_humidity: 51,
      uv: 5,
      icon_descriptor: 'shower',
      next_three_hourly_forecast_period: '2026-03-12T03:00:00Z',
      time: '2026-03-12T00:00:00Z',
      is_night: false,
      next_forecast_period: '2026-03-12T01:00:00Z',
    },
    {
      rain: {
        amount: { min: 0, max: null, units: 'mm' },
        chance: 20,
        precipitation_amount_10_percent_chance: 1,
        precipitation_amount_25_percent_chance: 0,
        precipitation_amount_50_percent_chance: 0,
      },
      temp: 17,
      temp_feels_like: 12,
      dew_point: 7,
      wind: {
        speed_knot: 14,
        speed_kilometre: 26,
        direction: 'SW',
        gust_speed_knot: 22,
        gust_speed_kilometre: 41,
      },
      relative_humidity: 52,
      uv: 5,
      icon_descriptor: 'shower',
      next_three_hourly_forecast_period: '2026-03-12T03:00:00Z',
      time: '2026-03-12T01:00:00Z',
      is_night: false,
      next_forecast_period: '2026-03-12T02:00:00Z',
    },
  ],
} as const

export const weatherApiWarningSummaryFixture = {
  metadata: {
    response_timestamp: '2026-03-12T00:33:03Z',
    copyright:
      'This application programming interface (API) is owned by the Bureau of Meteorology. You must not use, copy or share it. Find out more about our data services at https://www.bom.gov.au/resources/data-services.',
  },
  data: [
    {
      id: 'NSW_MW004_IDN20400',
      state: 'NSW',
      expiry_time: '2026-03-12T06:00:00Z',
      issue_time: '2026-03-11T23:00:00Z',
      type: 'marine_wind_warning',
      short_title: 'Marine Wind Warning',
      warning_group_type: 'marine',
      phase: 'renewal',
    },
  ],
} as const

export const weatherApiWarningDetailFixture = {
  metadata: {
    issue_time: '2026-03-11T23:00:00Z',
    response_timestamp: '2026-03-12T00:35:09Z',
    copyright:
      'This application programming interface (API) is owned by the Bureau of Meteorology. You must not use, copy or share it. Find out more about our data services at https://www.bom.gov.au/resources/data-services.',
  },
  data: {
    id: 'NSW_MW004_IDN20400',
    type: 'marine_wind_warning',
    title: 'Marine Wind Warning for New South Wales',
    short_title: 'Marine Wind Warning',
    state: 'NSW',
    message:
      '<div class="product"><p class="p-id">IDN20400</p><h2>Updated Marine Wind Warning Summary for New South Wales</h2></div>',
    issue_time: '2026-03-11T23:00:00Z',
    expiry_time: '2026-03-12T06:00:00Z',
    phase: 'renewal',
  },
} as const

export const weatherApiRain404Fixture = {
  errors: [
    {
      status: '404',
      detail: 'Not found',
    },
  ],
} as const

export const observationXmlFixture = `<?xml version="1.0"?>
<product xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="v1.7.1" xsi:noNamespaceSchemaLocation="http://www.bom.gov.au/schema/v1.7/product.xsd">
  <amoc>
    <source>
      <sender>Australian Government Bureau of Meteorology</sender>
      <region>Victoria</region>
      <office>VICRO</office>
      <copyright>http://www.bom.gov.au/other/copyright.shtml</copyright>
      <disclaimer>http://www.bom.gov.au/other/disclaimer.shtml</disclaimer>
    </source>
    <identifier>IDV60920</identifier>
    <issue-time-utc>2026-03-12T00:31:09+00:00</issue-time-utc>
  </amoc>
  <observations>
    <station wmo-id="95936" bom-id="086338" tz="Australia/Melbourne" stn-name="MELBOURNE (OLYMPIC PARK)" stn-height="7.53" type="AWS" lat="-37.8255" lon="144.9816" forecast-district-id="VIC_PW007" description="Melbourne (Olympic Park)">
      <period index="0" time-utc="2026-03-12T00:30:00+00:00" time-local="2026-03-12T11:30:00+11:00" wind-src="metar_10">
        <level index="0" type="surface">
          <element units="Celsius" type="apparent_temp">14.0</element>
          <element units="Celsius" type="air_temperature">17.1</element>
          <element units="Celsius" type="dew_point">8.8</element>
          <element units="hPa" type="msl_pres">1014.5</element>
          <element units="mm" type="rainfall">0.0</element>
          <element units="%" type="rel-humidity">58</element>
          <element type="wind_dir">SW</element>
          <element units="km/h" type="wind_spd_kmh">15</element>
        </level>
      </period>
    </station>
    <station wmo-id="94866" bom-id="086282" tz="Australia/Melbourne" stn-name="LAVERTON" stn-height="20.4" type="AWS" lat="-37.8636" lon="144.7567" forecast-district-id="VIC_PW004" description="Laverton">
      <period index="0" time-utc="2026-03-12T00:30:00+00:00" time-local="2026-03-12T11:30:00+11:00" wind-src="metar_10">
        <level index="0" type="surface">
          <element units="Celsius" type="air_temperature">16.4</element>
          <element units="mm" type="rainfall">0.0</element>
        </level>
      </period>
    </station>
  </observations>
</product>`

export const uvIndexXmlFixture = `<?xml version="1.0" encoding="UTF-8"?>
<product version="1.5" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.bom.gov.au/schema/v1.5/product.xsd">
  <amoc>
    <source>
      <sender>Australian Government Bureau of Meteorology</sender>
      <region>Head Office (ISS)</region>
      <office>ISS</office>
    </source>
    <identifier>IDZ00112</identifier>
    <issue-time-utc>2026-03-11T10:43:38Z</issue-time-utc>
  </amoc>
  <forecast>
    <area aac="VIC_FA001" description="Victoria" type="region"/>
    <area aac="VIC_PT001" description="Aireys Inlet" type="location">
      <forecast-period index="0">
        <text type="uv_alert">Sun protection recommended from 10:20 am to 4:40 pm, UV Index predicted to reach 7 [High]</text>
      </forecast-period>
    </area>
    <area aac="VIC_PT042" description="Melbourne" type="location">
      <forecast-period index="0">
        <text type="uv_alert">Sun protection recommended from 10:10 am to 5:10 pm, UV Index predicted to reach 8 [Very High]</text>
      </forecast-period>
    </area>
  </forecast>
</product>`

export const placeHtmlFixture = `<!doctype html>
<html>
  <body>
    <div id="summary-1">
      <ul>
        <li class="airT">17.6 °C</li>
      </ul>
    </div>
    <div class="forecasts-top">
      <span>issued at 4:20 pm AEDT on Thursday 12 March 2026.</span>
    </div>
    <dl class="forecast-summary">
      <dt class="date"><a>Thursday 12 March</a></dt>
      <dd class="min">13 °C</dd>
      <dd class="max">19 °C</dd>
      <dd class="summary">Shower or two.</dd>
    </dl>
    <p class="station-id">ID: 95936</p>
  </body>
</html>`
