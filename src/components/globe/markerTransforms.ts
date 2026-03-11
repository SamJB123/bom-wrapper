import * as THREE from 'three'

export function latLonToVector3(
  latitude: number,
  longitude: number,
  radius: number,
) {
  const phi = (90 - latitude) * (Math.PI / 180)
  const theta = (longitude + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

export function valueToMarkerScale(value: number | null) {
  if (value === null) {
    return 0.5
  }

  return Math.max(0.45, Math.min(1.2, 0.4 + value / 40))
}
