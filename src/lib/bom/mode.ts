import { bomDataModeSchema } from './types'

export function getBomDataMode() {
  const viteMode =
    typeof import.meta !== 'undefined' &&
    typeof import.meta.env !== 'undefined'
      ? import.meta.env.VITE_BOM_DATA_MODE
      : undefined

  const rawMode =
    viteMode ||
    (typeof process !== 'undefined' ? process.env.BOM_DATA_MODE : undefined) ||
    'fixture'

  return bomDataModeSchema.parse(rawMode)
}
