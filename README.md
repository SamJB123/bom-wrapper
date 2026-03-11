# BOM Access Layer

An external-facing weather platform built with TanStack Start on Cloudflare Workers.

It combines:

- a typed **oRPC + OpenAPI API**
- curated **BOM-style observation and forecast normalization**
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
- `VITE_BOM_FORECAST_BASE_URL=https://...`
- `BOM_FORECAST_BASE_URL=https://...`

Live forecast retrieval requires a configured forecast base URL. Observation live mode targets documented BOM-style JSON feed URLs for the curated station set.

## BOM attribution and usage

This project is built around Bureau of Meteorology-style products and should be attributed to the **Bureau of Meteorology**.

Please review BOM copyright and redistribution guidance before using this project beyond internal prototyping or demos:

- https://www.bom.gov.au/other/copyright.shtml
