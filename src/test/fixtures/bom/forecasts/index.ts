export const forecastFixtures = {
  IDD10198: `<?xml version="1.0" encoding="UTF-8"?>
<product type="forecast" version="1.0">
  <amoc>
    <source>
      <sender>Bureau of Meteorology</sender>
      <issue-time-utc>2026-03-11T04:10:00Z</issue-time-utc>
    </source>
  </amoc>
  <forecast>
    <area aac="darwin" description="Darwin" type="location">
      <forecast-period index="0" start-time-local="2026-03-11T00:00:00+09:30" end-time-local="2026-03-11T23:59:59+09:30">
        <text type="precis">Showers. Possible storm.</text>
        <text type="forecast">Hot and humid with showers and the risk of a late thunderstorm.</text>
        <element type="air_temperature_minimum">25</element>
        <element type="air_temperature_maximum">33</element>
        <element type="probability_of_precipitation">80%</element>
        <element type="precipitation_range">2 to 15 mm</element>
      </forecast-period>
      <forecast-period index="1" start-time-local="2026-03-12T00:00:00+09:30" end-time-local="2026-03-12T23:59:59+09:30">
        <text type="precis">Storm possible.</text>
        <text type="forecast">Partly cloudy morning followed by afternoon showers and possible storms.</text>
        <element type="air_temperature_minimum">25</element>
        <element type="air_temperature_maximum">32</element>
        <element type="probability_of_precipitation">70%</element>
        <element type="precipitation_range">1 to 12 mm</element>
      </forecast-period>
    </area>
  </forecast>
</product>`,
  IDN11050: `<?xml version="1.0" encoding="UTF-8"?>
<product type="forecast" version="1.0">
  <amoc>
    <source>
      <sender>Bureau of Meteorology</sender>
      <issue-time-utc>2026-03-11T04:00:00Z</issue-time-utc>
    </source>
  </amoc>
  <forecast>
    <area aac="sydney" description="Sydney" type="location">
      <forecast-period index="0" start-time-local="2026-03-11T00:00:00+11:00" end-time-local="2026-03-11T23:59:59+11:00">
        <text type="precis">Partly cloudy.</text>
        <text type="forecast">Sunny breaks with a light sea breeze in the afternoon.</text>
        <element type="air_temperature_minimum">19</element>
        <element type="air_temperature_maximum">27</element>
        <element type="probability_of_precipitation">20%</element>
        <element type="precipitation_range">0 to 1 mm</element>
      </forecast-period>
      <forecast-period index="1" start-time-local="2026-03-12T00:00:00+11:00" end-time-local="2026-03-12T23:59:59+11:00">
        <text type="precis">Showers developing.</text>
        <text type="forecast">Cloud increasing with a chance of a late shower.</text>
        <element type="air_temperature_minimum">20</element>
        <element type="air_temperature_maximum">25</element>
        <element type="probability_of_precipitation">60%</element>
        <element type="precipitation_range">0 to 4 mm</element>
      </forecast-period>
    </area>
    <area aac="canberra" description="Canberra" type="location">
      <forecast-period index="0" start-time-local="2026-03-11T00:00:00+11:00" end-time-local="2026-03-11T23:59:59+11:00">
        <text type="precis">Sunny.</text>
        <text type="forecast">A warm and mostly sunny day with gusty northwesterlies.</text>
        <element type="air_temperature_minimum">10</element>
        <element type="air_temperature_maximum">24</element>
        <element type="probability_of_precipitation">5%</element>
        <element type="precipitation_range">0 mm</element>
      </forecast-period>
      <forecast-period index="1" start-time-local="2026-03-12T00:00:00+11:00" end-time-local="2026-03-12T23:59:59+11:00">
        <text type="precis">Cloud increasing.</text>
        <text type="forecast">Partly cloudy with a slight chance of a late shower.</text>
        <element type="air_temperature_minimum">11</element>
        <element type="air_temperature_maximum">22</element>
        <element type="probability_of_precipitation">30%</element>
        <element type="precipitation_range">0 to 1 mm</element>
      </forecast-period>
    </area>
  </forecast>
</product>`,
  IDQ10605: `<?xml version="1.0" encoding="UTF-8"?>
<product type="forecast" version="1.0">
  <amoc>
    <source>
      <sender>Bureau of Meteorology</sender>
      <issue-time-utc>2026-03-11T04:15:00Z</issue-time-utc>
    </source>
  </amoc>
  <forecast>
    <area aac="brisbane" description="Brisbane" type="location">
      <forecast-period index="0" start-time-local="2026-03-11T00:00:00+10:00" end-time-local="2026-03-11T23:59:59+10:00">
        <text type="precis">Possible storm.</text>
        <text type="forecast">Humid with afternoon showers and the chance of a thunderstorm.</text>
        <element type="air_temperature_minimum">23</element>
        <element type="air_temperature_maximum">30</element>
        <element type="probability_of_precipitation">70%</element>
        <element type="precipitation_range">1 to 8 mm</element>
      </forecast-period>
      <forecast-period index="1" start-time-local="2026-03-12T00:00:00+10:00" end-time-local="2026-03-12T23:59:59+10:00">
        <text type="precis">Showers easing.</text>
        <text type="forecast">Cloudy with morning showers becoming isolated later.</text>
        <element type="air_temperature_minimum">22</element>
        <element type="air_temperature_maximum">28</element>
        <element type="probability_of_precipitation">60%</element>
        <element type="precipitation_range">0 to 4 mm</element>
      </forecast-period>
    </area>
  </forecast>
</product>`,
  IDS10037: `<?xml version="1.0" encoding="UTF-8"?>
<product type="forecast" version="1.0">
  <amoc>
    <source>
      <sender>Bureau of Meteorology</sender>
      <issue-time-utc>2026-03-11T03:40:00Z</issue-time-utc>
    </source>
  </amoc>
  <forecast>
    <area aac="adelaide" description="Adelaide" type="location">
      <forecast-period index="0" start-time-local="2026-03-11T00:00:00+10:30" end-time-local="2026-03-11T23:59:59+10:30">
        <text type="precis">Sunny and warm.</text>
        <text type="forecast">Mostly sunny with a fresh southwesterly in the late afternoon.</text>
        <element type="air_temperature_minimum">15</element>
        <element type="air_temperature_maximum">28</element>
        <element type="probability_of_precipitation">5%</element>
        <element type="precipitation_range">0 mm</element>
      </forecast-period>
      <forecast-period index="1" start-time-local="2026-03-12T00:00:00+10:30" end-time-local="2026-03-12T23:59:59+10:30">
        <text type="precis">Late shower.</text>
        <text type="forecast">Increasing cloud with a chance of a light evening shower.</text>
        <element type="air_temperature_minimum">16</element>
        <element type="air_temperature_maximum">26</element>
        <element type="probability_of_precipitation">30%</element>
        <element type="precipitation_range">0 to 1 mm</element>
      </forecast-period>
    </area>
  </forecast>
</product>`,
  IDT16700: `<?xml version="1.0" encoding="UTF-8"?>
<product type="forecast" version="1.0">
  <amoc>
    <source>
      <sender>Bureau of Meteorology</sender>
      <issue-time-utc>2026-03-11T03:55:00Z</issue-time-utc>
    </source>
  </amoc>
  <forecast>
    <area aac="hobart" description="Hobart" type="location">
      <forecast-period index="0" start-time-local="2026-03-11T00:00:00+11:00" end-time-local="2026-03-11T23:59:59+11:00">
        <text type="precis">Possible shower.</text>
        <text type="forecast">Partly cloudy with a cool westerly and the slight chance of a shower.</text>
        <element type="air_temperature_minimum">9</element>
        <element type="air_temperature_maximum">21</element>
        <element type="probability_of_precipitation">40%</element>
        <element type="precipitation_range">0 to 1 mm</element>
      </forecast-period>
      <forecast-period index="1" start-time-local="2026-03-12T00:00:00+11:00" end-time-local="2026-03-12T23:59:59+11:00">
        <text type="precis">Mostly sunny.</text>
        <text type="forecast">A chilly start followed by a mostly sunny day.</text>
        <element type="air_temperature_minimum">8</element>
        <element type="air_temperature_maximum">19</element>
        <element type="probability_of_precipitation">10%</element>
        <element type="precipitation_range">0 mm</element>
      </forecast-period>
    </area>
  </forecast>
</product>`,
  IDV10753: `<?xml version="1.0" encoding="UTF-8"?>
<product type="forecast" version="1.0">
  <amoc>
    <source>
      <sender>Bureau of Meteorology</sender>
      <issue-time-utc>2026-03-11T03:50:00Z</issue-time-utc>
    </source>
  </amoc>
  <forecast>
    <area aac="melbourne" description="Melbourne" type="location">
      <forecast-period index="0" start-time-local="2026-03-11T00:00:00+11:00" end-time-local="2026-03-11T23:59:59+11:00">
        <text type="precis">Shower or two.</text>
        <text type="forecast">Cloudy periods with the chance of a passing afternoon shower.</text>
        <element type="air_temperature_minimum">14</element>
        <element type="air_temperature_maximum">25</element>
        <element type="probability_of_precipitation">50%</element>
        <element type="precipitation_range">0 to 2 mm</element>
      </forecast-period>
      <forecast-period index="1" start-time-local="2026-03-12T00:00:00+11:00" end-time-local="2026-03-12T23:59:59+11:00">
        <text type="precis">Partly cloudy.</text>
        <text type="forecast">Morning cloud clearing to a mostly sunny afternoon.</text>
        <element type="air_temperature_minimum">13</element>
        <element type="air_temperature_maximum">23</element>
        <element type="probability_of_precipitation">20%</element>
        <element type="precipitation_range">0 mm</element>
      </forecast-period>
    </area>
  </forecast>
</product>`,
  IDW14199: `<?xml version="1.0" encoding="UTF-8"?>
<product type="forecast" version="1.0">
  <amoc>
    <source>
      <sender>Bureau of Meteorology</sender>
      <issue-time-utc>2026-03-11T04:20:00Z</issue-time-utc>
    </source>
  </amoc>
  <forecast>
    <area aac="perth" description="Perth" type="location">
      <forecast-period index="0" start-time-local="2026-03-11T00:00:00+08:00" end-time-local="2026-03-11T23:59:59+08:00">
        <text type="precis">Hot and sunny.</text>
        <text type="forecast">Sunny with a fresh afternoon sea breeze.</text>
        <element type="air_temperature_minimum">18</element>
        <element type="air_temperature_maximum">33</element>
        <element type="probability_of_precipitation">5%</element>
        <element type="precipitation_range">0 mm</element>
      </forecast-period>
      <forecast-period index="1" start-time-local="2026-03-12T00:00:00+08:00" end-time-local="2026-03-12T23:59:59+08:00">
        <text type="precis">Sunny.</text>
        <text type="forecast">Fine conditions continuing with moderate afternoon winds.</text>
        <element type="air_temperature_minimum">19</element>
        <element type="air_temperature_maximum">31</element>
        <element type="probability_of_precipitation">10%</element>
        <element type="precipitation_range">0 mm</element>
      </forecast-period>
    </area>
  </forecast>
</product>`,
} as const
