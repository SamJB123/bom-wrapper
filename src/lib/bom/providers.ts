import {
  bomLiveProviderPreferenceSchema,
  bomSourceProviderSchema,
  type BomDataMode,
  type BomLiveProviderPreference,
  type BomSourceProvider,
} from './types'

export function getBomLiveProviderPreference(): BomLiveProviderPreference {
  const viteProvider =
    typeof import.meta !== 'undefined' &&
    typeof import.meta.env !== 'undefined'
      ? import.meta.env.VITE_BOM_LIVE_PROVIDER
      : undefined

  const rawPreference =
    viteProvider ||
    (typeof process !== 'undefined'
      ? process.env.BOM_LIVE_PROVIDER
      : undefined) ||
    'auto'

  return bomLiveProviderPreferenceSchema.parse(rawPreference)
}

export function getDefaultProviderForMode(mode: BomDataMode): BomSourceProvider {
  if (mode === 'fixture') {
    return bomSourceProviderSchema.parse('fixture')
  }

  const preference = getBomLiveProviderPreference()

  if (preference === 'auto') {
    return bomSourceProviderSchema.parse('weather-api')
  }

  return bomSourceProviderSchema.parse(preference)
}

export function getOrderedLiveProviders() {
  const preference = getBomLiveProviderPreference()

  return preference === 'auto'
    ? (['weather-api', 'fwo-json'] as const)
    : ([preference] as const)
}
