import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js'
import { latLonToVector3 } from './markerTransforms'
import type { GlobeMarkerView } from './useGlobeData'

type MarkerMesh = THREE.Mesh<
  THREE.SphereGeometry,
  THREE.MeshStandardMaterial
> & {
  userData: {
    markerId: string
  }
}

export type BomSceneBundle = {
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  markerMeshes: Array<MarkerMesh>
  renderer: WebGPURenderer
  scene: THREE.Scene
  setMarkers: (markers: Array<GlobeMarkerView>) => void
  dispose: () => void
}

function createStarfield() {
  const starGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(1800 * 3)

  for (let index = 0; index < 1800; index += 1) {
    const radius = 18 + Math.random() * 16
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.cos(phi)
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }

  starGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
  )

  return new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0xf8fbff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    }),
  )
}

function createMarkerMesh(marker: GlobeMarkerView) {
  const geometry = new THREE.SphereGeometry(0.042 * marker.scale, 18, 18)
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(marker.color),
    emissive: new THREE.Color(marker.color),
    emissiveIntensity: 0.65,
    roughness: 0.35,
    metalness: 0.2,
  })

  const mesh = new THREE.Mesh(geometry, material) as MarkerMesh
  const position = latLonToVector3(
    marker.coordinates.latitude,
    marker.coordinates.longitude,
    1.03,
  )

  mesh.position.copy(position)
  mesh.userData = {
    markerId: marker.id,
  }

  return mesh
}

function disposeObject(object: THREE.Object3D) {
  const mesh = object as THREE.Mesh

  if (mesh.geometry) {
    mesh.geometry.dispose()
  }

  const material = mesh.material

  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose())
  } else if (material) {
    material.dispose()
  }
}

export async function createBomScene(container: HTMLDivElement) {
  if (!WebGPU.isAvailable()) {
    throw new Error(
      WebGPU.getErrorMessage().textContent ||
        'This browser does not currently expose WebGPU support.',
    )
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  )
  camera.position.set(3.5, 1.5, 2.7)

  const renderer = new WebGPURenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  await renderer.init()

  container.innerHTML = ''
  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableDamping = true
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.35
  controls.minDistance = 2.2
  controls.maxDistance = 6
  controls.target.set(0, 0, 0)

  const worldGroup = new THREE.Group()
  worldGroup.rotation.y = -2.35
  scene.add(worldGroup)

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    }),
  )

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0f3c78,
      roughness: 0.78,
      metalness: 0.05,
      emissive: 0x07172a,
      emissiveIntensity: 0.4,
    }),
  )

  const wireframe = new THREE.Mesh(
    new THREE.SphereGeometry(1.002, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    }),
  )

  const markerGroup = new THREE.Group()

  worldGroup.add(earth)
  worldGroup.add(wireframe)
  worldGroup.add(atmosphere)
  worldGroup.add(markerGroup)

  scene.add(createStarfield())
  scene.add(new THREE.AmbientLight(0xbcd7ff, 1.25))

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
  keyLight.position.set(3, 1.5, 3)
  scene.add(keyLight)

  const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.6)
  rimLight.position.set(-3.5, -1.2, -2)
  scene.add(rimLight)

  let animationFrame = 0
  let markerMeshes: Array<MarkerMesh> = []

  function render() {
    controls.update()
    renderer.render(scene, camera)
    animationFrame = window.requestAnimationFrame(render)
  }

  function setMarkers(markers: Array<GlobeMarkerView>) {
    markerMeshes.forEach((mesh) => {
      markerGroup.remove(mesh)
      disposeObject(mesh)
    })

    markerMeshes = markers.map((marker) => {
      const mesh = createMarkerMesh(marker)
      markerGroup.add(mesh)
      return mesh
    })
  }

  function handleResize() {
    const width = container.clientWidth
    const height = container.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  window.addEventListener('resize', handleResize)
  render()

  return {
    camera,
    controls,
    markerMeshes,
    renderer,
    scene,
    setMarkers(markers: Array<GlobeMarkerView>) {
      setMarkers(markers)
      this.markerMeshes = markerMeshes
    },
    dispose() {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      markerMeshes.forEach((mesh) => disposeObject(mesh))
      renderer.dispose()
      container.innerHTML = ''
    },
  } satisfies BomSceneBundle
}
