# BOM Access Layer

An external-facing weather platform built with TanStack Start on Cloudflare Workers.

It combines:

- a typed **oRPC + OpenAPI API**
- curated and live **BOM observation and forecast normalization**
- an internal **TypeScript port of the relevant weather-au capability set**
- a polished **Three.js WebGPU globe route**

## What it includes

### API

- `GET /api/v1/health`
- `GET /api/v1/sources`
- `GET /api/v1/locations/search`
- `GET /api/v1/stations`
- `GET /api/v1/stations/{stationId}`
- `GET /api/v1/stations/{stationId}/observation`
- `GET /api/v1/forecasts/{locationId}`
- `GET /api/v1/overview/australia`
- `GET /api/v1/locations/{locationId}/summary`
- `GET /api/v1/locations/{locationId}/warnings`
- `GET /api/v1/locations/{locationId}/uv`
- `GET /api/openapi.json`
- `GET /api/docs`

### UI

- Product landing page
- Interactive API docs
- Australia weather globe route at `/globe`
- Graceful WebGPU fallback state when browser support is unavailable

## Development

```sh
pnpm install
pnpm dev
```

The local dev server starts on port `3000` by default.

## Tests

Run the targeted automated suite:

```sh
pnpm exec vitest run
```

## Production build

```sh
pnpm build
```

## Deployment

```sh
pnpm run deploy
```

## Data mode

This project defaults to **fixture mode** so the API and globe remain fully testable in environments where automated access to live BOM infrastructure is blocked.

Optional runtime toggles:

- `VITE_BOM_DATA_MODE=live`
- `BOM_DATA_MODE=live`
- `VITE_BOM_LIVE_PROVIDER=auto|weather-api|fwo-json`
- `BOM_LIVE_PROVIDER=auto|weather-api|fwo-json`
- `VITE_BOM_FORECAST_BASE_URL=https://...`
- `BOM_FORECAST_BASE_URL=https://...`

Live provider behavior:

- `weather-api` uses the live endpoint family referenced by weather-au
- `fwo-json` / XML fallback uses BOM FWO-style products where configured and reachable
- `auto` prefers `weather-api` first and can fall back to FWO-backed sources

The Worker still defaults to **fixture mode** for deterministic testing and safer deployment.

## Internal weather-au TypeScript port

This repo now includes a TypeScript reimplementation of the key weather-au module families:

- Weather API
- Observations XML
- Place page parsing
- UV index XML
- Summary aggregation

It is used as the live BOM integration layer underneath the normalized API surface.

## BOM attribution and usage

This project is built around Bureau of Meteorology-style products and should be attributed to the **Bureau of Meteorology**.

Please review BOM copyright and redistribution guidance before using this project beyond internal prototyping or demos:

- https://www.bom.gov.au/other/copyright.shtml
