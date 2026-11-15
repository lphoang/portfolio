export type PoseInput = {
  t: number // now, in ms
  offset: number // rotation from dragging, in radians
  lastInput: number // when the visitor last dragged, in ms
  hopAt: number // when the last click started a hop, in ms
  phase: number // per-figure offset so figures don't move in sync
  reducedMotion: boolean
}

const SWAY = 0.6 // radians to each side
const SWAY_PERIOD = 1600
const IDLE_AFTER = 2500 // ms after the last drag before swaying again
const HOP_MS = 450
const HOP_HEIGHT = 2.5
const BOB = 0.15
const BOB_PERIOD = 500

// Where the figure is at time t: idle sway, a gentle bob, and a hop after a click.
// With reduced motion it only follows the visitor's drag.
export function pose(input: PoseInput): { rotationY: number; y: number } {
  const { t, offset, lastInput, hopAt, phase, reducedMotion } = input
  if (reducedMotion) return { rotationY: offset, y: 0 }

  const idle = t - lastInput > IDLE_AFTER
  const sway = idle ? SWAY * Math.sin(t / SWAY_PERIOD + phase) : 0

  const h = (t - hopAt) / HOP_MS
  const hop = h >= 0 && h <= 1 ? Math.sin(h * Math.PI) * HOP_HEIGHT : 0
  const bob = Math.sin(t / BOB_PERIOD + phase) * BOB

  return { rotationY: offset + sway, y: hop + bob }
}
