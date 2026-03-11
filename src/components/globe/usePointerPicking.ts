import * as THREE from 'three'
import { useEffect } from 'react'
import type { BomSceneBundle } from './createBomScene'

export function usePointerPicking({
  containerRef,
  sceneRef,
  onHover,
  onSelect,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  sceneRef: React.RefObject<BomSceneBundle | null>
  onHover: (markerId: string | null, pointer: { x: number; y: number } | null) => void
  onSelect: (markerId: string | null) => void
}) {
  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const currentContainer = container

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    function getMarkerId(event: PointerEvent) {
      const currentScene = sceneRef.current

      if (!currentScene) {
        return null
      }

      const bounds = currentContainer.getBoundingClientRect()

      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1

      raycaster.setFromCamera(pointer, currentScene.camera)

      const intersections = raycaster.intersectObjects(
        currentScene.markerMeshes,
        false,
      )

      return intersections[0]?.object.userData.markerId ?? null
    }

    function handlePointerMove(event: PointerEvent) {
      const markerId = getMarkerId(event)
      const bounds = currentContainer.getBoundingClientRect()

      currentContainer.style.cursor = markerId ? 'pointer' : 'default'
      onHover(
        markerId,
        markerId
          ? {
              x: event.clientX - bounds.left,
              y: event.clientY - bounds.top,
            }
          : null,
      )
    }

    function handlePointerLeave() {
      currentContainer.style.cursor = 'default'
      onHover(null, null)
    }

    function handlePointerUp(event: PointerEvent) {
      onSelect(getMarkerId(event))
    }

    currentContainer.addEventListener('pointermove', handlePointerMove)
    currentContainer.addEventListener('pointerleave', handlePointerLeave)
    currentContainer.addEventListener('pointerup', handlePointerUp)

    return () => {
      currentContainer.removeEventListener('pointermove', handlePointerMove)
      currentContainer.removeEventListener('pointerleave', handlePointerLeave)
      currentContainer.removeEventListener('pointerup', handlePointerUp)
      currentContainer.style.cursor = 'default'
    }
  }, [containerRef, onHover, onSelect, sceneRef])
}
