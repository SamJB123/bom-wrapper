import { bomDataModeSchema } from './types'

export function getBomDataMode() {
  const rawMode =
    import.meta.env.VITE_BOM_DATA_MODE ||
    (typeof process !== 'undefined' ? process.env.BOM_DATA_MODE : undefined) ||
    'fixture'

  return bomDataModeSchema.parse(rawMode)
}
