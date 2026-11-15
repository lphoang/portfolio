import { createRainPainter, createStarryPainter, reborn } from './painters'

// A canvas context that accepts any drawing call and counts the ones we care about.
function fakeContext() {
  const calls: Record<string, number> = {}
  const gradient = { addColorStop: () => {} }
  const ctx = new Proxy({} as Record<string, unknown>, {
    get(target, prop: string) {
      if (prop in target) return target[prop]
      return () => {
        calls[prop] = (calls[prop] ?? 0) + 1
        return gradient
      }
    },
    set(target, prop: string, value) {
      target[prop] = value
      return true
    }
  })
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls }
}

beforeAll(() => {
  globalThis.Path2D = class {
    moveTo() {}
    lineTo() {}
  } as unknown as typeof Path2D
})

afterEach(() => vi.unstubAllGlobals())

test('a stroke that dies comes back on the canvas, never off to the right', () => {
  for (let i = 0; i < 500; i++) {
    const s = reborn(1200, 800)
    expect(s.x).toBeGreaterThanOrEqual(-5)
    expect(s.x).toBeLessThanOrEqual(1200)
  }
})

test('the swirl moves at the same speed on a 120 Hz screen as on 60 Hz', () => {
  const { ctx, calls } = fakeContext()
  const sky = createStarryPainter(ctx)
  sky.resize(800, 600)
  calls.fillRect = 0
  // One second at 120 frames a second.
  for (let t = 0; t <= 1000; t += 1000 / 120) sky.frame(t)
  // Each step fades the canvas once: about 60 steps, not 120.
  expect(calls.fillRect).toBeGreaterThanOrEqual(55)
  expect(calls.fillRect).toBeLessThanOrEqual(65)
})

test('the rain looks up its font once, not on every frame', () => {
  const getComputedStyle = vi.fn(() => ({
    getPropertyValue: () => "'VT323'"
  }))
  vi.stubGlobal('getComputedStyle', getComputedStyle)
  vi.stubGlobal('document', { documentElement: {} })
  const { ctx } = fakeContext()
  const rain = createRainPainter(ctx)
  rain.resize(800, 600)
  for (let t = 0; t <= 2000; t += 16) rain.frame(t)
  expect(getComputedStyle).toHaveBeenCalledTimes(1)
})
