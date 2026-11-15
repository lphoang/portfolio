import { pose } from './pose'

const base = {
  offset: 0.4,
  lastInput: -1e9,
  hopAt: -1e9,
  phase: 1.7,
  reducedMotion: false
}
const bob = (t: number) => Math.sin(t / 500 + base.phase) * 0.15

test('reduced motion: only the drag offset, no movement', () => {
  for (const t of [0, 1234, 5000]) {
    expect(pose({ ...base, t, reducedMotion: true, hopAt: t - 225 })).toEqual({
      rotationY: 0.4,
      y: 0
    })
  }
})

test('idle sways around the offset', () => {
  const t = 10_000
  expect(pose({ ...base, t }).rotationY).toBeCloseTo(
    0.4 + 0.6 * Math.sin(t / 1600 + 1.7)
  )
})

test('recent drag holds still', () => {
  const t = 10_000
  expect(pose({ ...base, t, lastInput: t - 1000 }).rotationY).toBe(0.4)
})

test('hop peaks halfway', () => {
  const t = 10_000
  expect(pose({ ...base, t, hopAt: t - 225 }).y).toBeCloseTo(2.5 + bob(t))
})

test('no hop outside its 450 ms', () => {
  const t = 10_000
  expect(pose({ ...base, t, hopAt: t - 600 }).y).toBeCloseTo(bob(t))
})
