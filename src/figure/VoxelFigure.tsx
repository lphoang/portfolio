'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BoxGeometry, type Group, type InstancedMesh, Matrix4 } from 'three'

import type { Era } from '@/lib/era'
import { useEra } from '@/lib/useEra'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { figureUrl, lightsFor, pickShown } from './figureEra'
import type { Variant } from './model'
import { easeOffset, frameloopFor, pose } from './pose'
import type { FigureData } from './voxelize'
import { hasWebGL } from './webgl'

// Model units visible across the canvas; the figure is about 29 units tall with the 1889 hat.
const VIEW_UNITS = 34
const PHASE: Record<Variant, number> = { dev: 0, creator: 1.7, player: 3.4 }
const DRAG_SPEED = 0.012 // radians per pixel
const CLICK_SLOP = 4 // px of movement that still counts as a click

function ColorGroup({
  data,
  color,
  cells
}: {
  data: FigureData
  color: string
  cells: number[]
}) {
  const ref = useRef<InstancedMesh>(null)
  const geometry = useMemo(
    () => new BoxGeometry(data.step, data.step, data.step),
    [data.step]
  )
  const count = cells.length / 3

  useLayoutEffect(() => {
    const mesh = ref.current!
    const matrix = new Matrix4()
    const [ox, oy, oz] = data.origin
    for (let n = 0; n < count; n++) {
      matrix.makeTranslation(
        ox + (cells[n * 3] + 0.5) * data.step,
        oy + (cells[n * 3 + 1] + 0.5) * data.step,
        oz + (cells[n * 3 + 2] + 0.5) * data.step
      )
      mesh.setMatrixAt(n, matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [cells, count, data])

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]}>
      <meshLambertMaterial color={color} />
    </instancedMesh>
  )
}

// Center of the figure's bounding box, as an offset that moves it to the origin.
function centerOffset(data: FigureData): [number, number, number] {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const { cells } of data.groups)
    for (let n = 0; n < cells.length; n++) {
      const axis = n % 3
      min[axis] = Math.min(min[axis], cells[n])
      max[axis] = Math.max(max[axis], cells[n])
    }
  const offset = (axis: number) =>
    -(data.origin[axis] + ((min[axis] + max[axis] + 1) / 2) * data.step)
  return [offset(0), offset(1), offset(2)]
}

function Scene({
  data,
  variant,
  era,
  reducedMotion
}: {
  data: FigureData
  variant: Variant
  era: Era
  reducedMotion: boolean
}) {
  const pivot = useRef<Group>(null)
  const motion = useRef({ offset: 0, lastInput: -1e9, hopAt: -1e9 })
  const lights = lightsFor(era)
  const canvas = useThree(state => state.gl.domElement)
  // With reduced motion the canvas only draws on request (see frameloopFor).
  const invalidate = useThree(state => state.invalidate)
  const center = useMemo(() => centerOffset(data), [data])

  // Horizontal drags spin the figure; a click without movement makes it hop.
  useEffect(() => {
    let drag: { x: number; moved: number } | null = null
    const down = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId)
      drag = { x: event.clientX, moved: 0 }
    }
    const move = (event: PointerEvent) => {
      if (!drag) return
      const dx = event.clientX - drag.x
      drag = { x: event.clientX, moved: drag.moved + Math.abs(dx) }
      motion.current.offset += dx * DRAG_SPEED
      motion.current.lastInput = performance.now()
      invalidate()
    }
    const up = () => {
      if (drag && drag.moved < CLICK_SLOP)
        motion.current.hopAt = performance.now()
      drag = null
    }
    const cancel = () => {
      drag = null
    }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', cancel)
    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', cancel)
    }
  }, [canvas, invalidate])

  useFrame(({ camera, size }) => {
    // Fit the figure to the canvas whenever its size changes.
    const zoom = Math.min(size.width, size.height) / VIEW_UNITS
    if (camera.zoom !== zoom) {
      camera.zoom = zoom
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }

    const m = motion.current
    const t = performance.now()
    m.offset = easeOffset({ ...m, t, reducedMotion })
    const p = pose({ t, ...m, phase: PHASE[variant], reducedMotion })
    pivot.current!.rotation.y = p.rotationY
    pivot.current!.position.y = p.y
  })

  return (
    <>
      <ambientLight color={lights.ambient[0]} intensity={lights.ambient[1]} />
      <directionalLight
        position={[8, 14, 12]}
        color={lights.key[0]}
        intensity={lights.key[1]}
      />
      <directionalLight
        position={[-12, 6, -8]}
        color={lights.rim[0]}
        intensity={lights.rim[1]}
      />
      <group ref={pivot}>
        <group position={center}>
          {data.groups.map(group => (
            <ColorGroup
              key={group.color}
              data={data}
              color={group.color}
              cells={group.cells}
            />
          ))}
        </group>
      </group>
    </>
  )
}

type Props = { variant: Variant; inView: boolean }

export default function VoxelFigure({ variant, inView }: Props) {
  const era = useEra()
  const reducedMotion = useReducedMotion()
  const [loaded, setLoaded] = useState<Partial<Record<Era, FigureData>>>({})

  // Load this era's figure now and the other era's once the browser is idle,
  // so switching eras swaps outfits without waiting.
  useEffect(() => {
    // No WebGL: skip the download too; the placeholder stays.
    if (!hasWebGL()) return
    let cancelled = false
    const load = (which: Era) =>
      fetch(figureUrl(variant, which))
        .then(res => res.json() as Promise<FigureData>)
        .then(figure => {
          if (!cancelled)
            setLoaded(prev =>
              prev[which] ? prev : { ...prev, [which]: figure }
            )
        })
        .catch(() => {
          // Without the data the placeholder (or the other outfit) simply stays.
        })
    load(era)
    const other: Era = era === 'starry' ? 'terminal' : 'starry'
    const idle = 'requestIdleCallback' in window
    const handle = idle
      ? window.requestIdleCallback(() => load(other), { timeout: 3000 })
      : window.setTimeout(() => load(other), 1500)
    return () => {
      cancelled = true
      if (idle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [variant, era])

  const shown = pickShown(loaded, era)
  if (!shown) return null

  return (
    <Canvas
      orthographic
      camera={{ position: [14, 12, 34], near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{ antialias: false }}
      frameloop={frameloopFor({ inView, reducedMotion })}
      aria-hidden
      // pan-y: vertical swipes still scroll the page on phones.
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
    >
      <Scene
        data={loaded[shown]!}
        variant={variant}
        era={shown}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  )
}
