// Three.js throws while creating its renderer when WebGL2 is missing (it dropped
// WebGL1), which would break the whole page. Asking first lets the figure simply
// stay a placeholder.
export function hasWebGL(
  createCanvas: () => HTMLCanvasElement = () => document.createElement('canvas')
): boolean {
  try {
    const gl = createCanvas().getContext('webgl2')
    // Free the test context right away; browsers only allow a few at once.
    gl?.getExtension?.('WEBGL_lose_context')?.loseContext()
    return gl !== null
  } catch {
    return false
  }
}
