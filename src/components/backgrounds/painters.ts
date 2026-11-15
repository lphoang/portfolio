import {
  BLUES,
  RAIN_GLYPHS,
  RAIN_GREENS,
  STARS,
  STAR_CORE,
  flow
} from './motion'

// A background painter: resize sets up the canvas, frame draws one animation
// step, still draws a single calm frame for reduced motion.
export type Painter = {
  resize(width: number, height: number): void
  frame(time: number): void
  still(): void
}

const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)]

// ---------- 1889: brush strokes flowing around swirls, glowing stars, the moon ----------

type Stroke = { x: number; y: number; life: number; color: string }

export function createStarryPainter(ctx: CanvasRenderingContext2D): Painter {
  let w = 0
  let h = 0
  let t = 0
  let strokes: Stroke[] = []

  const spawn = (): Stroke => ({
    x: Math.random() * w,
    y: Math.random() * h * 0.8,
    life: 60 + Math.random() * 120,
    color: pick(BLUES)
  })

  function paintBase() {
    const sky = ctx.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#0b1d48')
    sky.addColorStop(1, '#0a1a3f')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)
  }

  // Fade old strokes a little, then move every stroke one step along the swirl.
  // Segments are batched by color, so each frame needs only a few draw calls.
  function paintStrokes() {
    t++
    ctx.fillStyle = 'rgba(10,26,63,0.035)'
    ctx.fillRect(0, 0, w, h)
    const paths = new Map<string, Path2D>()
    for (const s of strokes) {
      const [vx, vy] = flow(s.x, s.y, t, w, h)
      const nx = s.x + vx * 2.2
      const ny = s.y + vy * 2.2
      let path = paths.get(s.color)
      if (!path) paths.set(s.color, (path = new Path2D()))
      path.moveTo(s.x, s.y)
      path.lineTo(nx, ny)
      s.x = nx
      s.y = ny
      s.life--
      if (s.life < 0 || s.x > w + 10 || s.y < -10 || s.y > h)
        Object.assign(s, spawn(), { x: Math.random() < 0.5 ? -5 : s.x })
    }
    ctx.lineCap = 'round'
    ctx.lineWidth = 2.4
    ctx.globalAlpha = 0.55
    for (const [color, path] of paths) {
      ctx.strokeStyle = color
      ctx.stroke(path)
    }
    ctx.globalAlpha = 1
  }

  function paintStarsAndMoon(pulse: boolean) {
    for (const [sx, sy, r] of STARS) {
      const x = sx * w
      const y = sy * h
      const size = r * (pulse ? 1 + 0.12 * Math.sin(t * 0.03 + sx * 9) : 1)
      const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 2.4)
      glow.addColorStop(0, STAR_CORE)
      glow.addColorStop(0.25, 'rgba(244,211,94,.75)')
      glow.addColorStop(1, 'rgba(244,211,94,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, size * 2.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(247,228,139,.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, size * 1.3, 0, Math.PI * 2)
      ctx.stroke()
    }
    const mx = 0.9 * w
    const my = 0.14 * h
    const mr = Math.min(w, h) * 0.05
    const halo = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 2.6)
    halo.addColorStop(0, 'rgba(255,214,90,.9)')
    halo.addColorStop(0.4, 'rgba(244,180,60,.5)')
    halo.addColorStop(1, 'rgba(244,180,60,0)')
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(mx, my, mr * 2.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffd65a'
    ctx.beginPath()
    ctx.arc(mx, my, mr, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#c98a1c'
    ctx.beginPath()
    ctx.arc(mx + mr * 0.45, my - mr * 0.2, mr * 0.85, 0, Math.PI * 2)
    ctx.fill()
  }

  return {
    resize(width, height) {
      w = width
      h = height
      paintBase()
      strokes = Array.from({ length: Math.min(900, (w * h) / 1400) }, spawn)
    },
    frame() {
      paintStrokes()
      paintStarsAndMoon(true)
    },
    // Let the strokes run for a while off-screen, then show that single painting.
    still() {
      paintBase()
      for (let i = 0; i < 240; i++) paintStrokes()
      paintStarsAndMoon(false)
    }
  }
}

// ---------- terminal: faint falling characters in many greens ----------

type Column = { y: number; speed: number; color: string }

export function createRainPainter(ctx: CanvasRenderingContext2D): Painter {
  const SIZE = 16
  let w = 0
  let h = 0
  let last = 0
  let columns: Column[] = []
  // next/font gives the font a generated family name; read it from its variable.
  const font = () =>
    `${SIZE}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-vt323') || 'monospace'}`

  function clear(alpha: number) {
    ctx.fillStyle = `rgba(3,8,5,${alpha})`
    ctx.fillRect(0, 0, w, h)
  }

  function glyph(x: number, y: number, color: string, alpha: number) {
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.fillText(pick([...RAIN_GLYPHS]), x, y)
    ctx.globalAlpha = 1
  }

  return {
    resize(width, height) {
      w = width
      h = height
      columns = Array.from({ length: Math.ceil(w / SIZE) }, () => ({
        y: Math.random() * h,
        speed: 0.4 + Math.random() * 0.9,
        color: pick(RAIN_GREENS)
      }))
      clear(1)
    },
    // About 20 updates a second is enough for falling characters.
    frame(time) {
      if (time - last < 50) return
      last = time
      clear(0.12)
      ctx.font = font()
      columns.forEach((col, i) => {
        glyph(i * SIZE, col.y, col.color, 0.28)
        col.y += SIZE * col.speed
        if (col.y > h + 20 && Math.random() > 0.97) col.y = -20
      })
    },
    still() {
      clear(1)
      ctx.font = font()
      columns.forEach((col, i) => {
        for (let k = 0; k < 6; k++)
          glyph(i * SIZE, Math.random() * h, col.color, 0.18)
      })
    }
  }
}
