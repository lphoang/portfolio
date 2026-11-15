import { hasWebGL } from './webgl'

const canvasWith = (getContext: () => unknown) => () =>
  ({ getContext }) as unknown as HTMLCanvasElement

test('a canvas that gives a WebGL context means WebGL works', () => {
  expect(hasWebGL(canvasWith(() => ({})))).toBe(true)
})

test('no WebGL context (old phone, blocked GPU) means no figure', () => {
  expect(hasWebGL(canvasWith(() => null))).toBe(false)
})

test('a browser that throws while asking for WebGL means no figure', () => {
  expect(
    hasWebGL(
      canvasWith(() => {
        throw new Error('blocked')
      })
    )
  ).toBe(false)
})

test('WebGL1 only is not enough: three.js needs WebGL2', () => {
  const canvas = () =>
    ({
      getContext: (type: string) => (type === 'webgl' ? {} : null)
    }) as unknown as HTMLCanvasElement
  expect(hasWebGL(canvas)).toBe(false)
})
