import { easeOffset, frameloopFor, pose } from './pose'

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

describe('easeOffset', () => {
  test('eases the drag rotation back once idle', () => {
    expect(
      easeOffset({ offset: 1, t: 10_000, lastInput: 0, reducedMotion: false })
    ).toBeCloseTo(0.97)
  })
  test('keeps the drag rotation while the visitor is still dragging', () => {
    expect(
      easeOffset({
        offset: 1,
        t: 10_000,
        lastInput: 9_000,
        reducedMotion: false
      })
    ).toBe(1)
  })
  test('with reduced motion the figure stays where the visitor left it', () => {
    expect(
      easeOffset({ offset: 1, t: 10_000, lastInput: 0, reducedMotion: true })
    ).toBe(1)
  })
})

describe('frameloopFor', () => {
  test('off screen: draw nothing', () => {
    expect(frameloopFor({ inView: false, reducedMotion: false })).toBe('never')
    expect(frameloopFor({ inView: false, reducedMotion: true })).toBe('never')
  })
  test('on screen: animate every frame', () => {
    expect(frameloopFor({ inView: true, reducedMotion: false })).toBe('always')
  })
  test('reduced motion: only draw when something changes', () => {
    expect(frameloopFor({ inView: true, reducedMotion: true })).toBe('demand')
  })
})
