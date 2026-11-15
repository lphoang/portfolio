// Three.js throws while creating its renderer when WebGL is missing, which would
// break the whole page. Asking first lets the figure simply stay a placeholder.
export function hasWebGL(
  createCanvas: () => HTMLCanvasElement = () => document.createElement('canvas')
): boolean {
  try {
    const canvas = createCanvas()
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}
