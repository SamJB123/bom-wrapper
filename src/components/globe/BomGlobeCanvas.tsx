import { useEffect, useMemo, useRef, useState } from 'react'
import type { AustraliaOverviewResponse } from '~/lib/bom/types'
import { GlobeEmptyState } from './GlobeEmptyState'
import { GlobeLegend } from './GlobeLegend'
import { GlobeSidebar } from './GlobeSidebar'
import { GlobeStatusBar } from './GlobeStatusBar'
import { GlobeTooltip } from './GlobeTooltip'
import { GlobeUnsupportedState } from './GlobeUnsupportedState'
import { createBomScene, type BomSceneBundle } from './createBomScene'
import { type GlobeMetric } from './colorScales'
import { useGlobeData } from './useGlobeData'
import { usePointerPicking } from './usePointerPicking'

export function BomGlobeCanvas({
  overview,
}: {
  overview: AustraliaOverviewResponse
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<BomSceneBundle | null>(null)
  const [metric, setMetric] = useState<GlobeMetric>('temperature')
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(
    overview.markers[0]?.id ?? null,
  )
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null)
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)
  const [unsupportedMessage, setUnsupportedMessage] = useState<string | null>(
    null,
  )

  const markers = useGlobeData(overview, metric)

  useEffect(() => {
    if (selectedMarkerId && markers.some((marker) => marker.id === selectedMarkerId)) {
      return
    }

    setSelectedMarkerId(markers[0]?.id ?? null)
  }, [markers, selectedMarkerId])

  useEffect(() => {
    const container = containerRef.current

    if (!container || sceneRef.current || markers.length === 0) {
      return
    }

    let active = true

    createBomScene(container)
      .then((scene) => {
        if (!active) {
          scene.dispose()
          return
        }

        sceneRef.current = scene
        scene.setMarkers(markers)
        setUnsupportedMessage(null)
      })
      .catch((error) => {
        setUnsupportedMessage(
          error instanceof Error
            ? error.message
            : 'The globe could not initialize in this browser.',
        )
      })

    return () => {
      active = false
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [markers])

  useEffect(() => {
    sceneRef.current?.setMarkers(markers)
  }, [markers])

  usePointerPicking({
    containerRef,
    sceneRef,
    onHover: (markerId, nextPointer) => {
      setHoveredMarkerId(markerId)
      setPointer(nextPointer)
    },
    onSelect: (markerId) => {
      if (markerId) {
        setSelectedMarkerId(markerId)
      }
    },
  })

  const selectedMarker = useMemo(() => {
    return markers.find((marker) => marker.id === selectedMarkerId) ?? null
  }, [markers, selectedMarkerId])

  const hoveredMarker = useMemo(() => {
    return markers.find((marker) => marker.id === hoveredMarkerId) ?? null
  }, [hoveredMarkerId, markers])

  return (
    <div className="space-y-6">
      <GlobeStatusBar
        markerCount={markers.length}
        generatedAt={overview.generatedAt}
        dataMode={overview.dataMode}
        provider={overview.provider}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <section className="rounded-[32px] border border-white/10 bg-slate-950/65 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.32)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-2">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Australia weather globe
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">
                WebGPU-first spatial weather exploration
              </h2>
            </div>
            <a
              href="/api/docs"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/35 hover:text-white"
            >
              Inspect API docs
            </a>
          </div>

          {markers.length === 0 ? (
            <GlobeEmptyState />
          ) : unsupportedMessage ? (
            <GlobeUnsupportedState message={unsupportedMessage} />
          ) : (
            <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.14),transparent_30%),linear-gradient(180deg,rgba(8,15,29,0.96)_0%,rgba(4,7,15,0.98)_100%)]">
              <div
                ref={containerRef}
                className="h-[620px] w-full"
                aria-label="Three dimensional Australia weather globe"
              />
              <GlobeTooltip marker={hoveredMarker} pointer={pointer} />
            </div>
          )}
        </section>

        <div className="space-y-6">
          <GlobeLegend metric={metric} onMetricChange={setMetric} />
          <GlobeSidebar marker={selectedMarker} />

          <section className="rounded-[28px] border border-amber-300/20 bg-amber-300/8 p-6 text-sm leading-7 text-amber-50/90 shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-100/80">
              Data note
            </div>
            <p className="mt-3">
              This globe is driven by the normalized overview endpoint and
              defaults to curated fixtures so the interface remains testable
              without relying on live automated access to BOM infrastructure.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
