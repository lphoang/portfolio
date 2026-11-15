'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'
import { BoxGeometry, type Group, type InstancedMesh, Matrix4 } from 'three'

import type { Variant } from './model'
import { easeOffset, frameloopFor, pose } from './pose'
import type { FigureData } from './voxelize'
import { hasWebGL } from './webgl'

// Model units visible across the canvas; the figure is about 25 units tall.
const VIEW_UNITS = 31
const PHASE: Record<Variant, number> = { dev: 0, creator: 1.7, player: 3.4 }
const DRAG_SPEED = 0.012 // radians per pixel
const CLICK_SLOP = 4 // px of movement that still counts as a click

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
  reducedMotion
}: {
  data: FigureData
  variant: Variant
  reducedMotion: boolean
}) {
  const pivot = useRef<Group>(null)
  const motion = useRef({ offset: 0, lastInput: -1e9, hopAt: -1e9 })
  // Both eras are dark; per-era lights arrive with the era-aware figure.
  const dark = true
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
      <ambientLight intensity={dark ? 1.35 : 1.15} />
      <directionalLight position={[8, 14, 12]} intensity={dark ? 2.0 : 1.7} />
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
  const [data, setData] = useState<FigureData | null>(null)
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    () => false
  )

  useEffect(() => {
    // No WebGL: skip the download too; the placeholder stays.
    if (!hasWebGL()) return
    let cancelled = false
    fetch(`/figures/${variant}.json`)
      .then(res => res.json() as Promise<FigureData>)
      .then(figure => {
        if (!cancelled) setData(figure)
      })
      .catch(() => {
        // Without the data the placeholder simply stays.
      })
    return () => {
      cancelled = true
    }
  }, [variant])

  if (!data) return null

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
      <Scene data={data} variant={variant} reducedMotion={reducedMotion} />
    </Canvas>
  )
}
