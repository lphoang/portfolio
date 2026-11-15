// The approved "voxel you" shape model, ported unchanged from
// docs/superpowers/specs/2026-11-15-portfolio-refresh/figure-reference.html.
// Units: one unit is one cube at 1x detail; y points up, the face looks toward +z.
// colorAt says which color the figure has at a point, or null for empty space.

export type Variant = 'dev' | 'player' | 'creator'

const COL = {
  skin: '#e9b98f',
  nose: '#dfa983',
  lip: '#c4746a',
  lipTop: '#d48a7c',
  eye: '#141010',
  sclera: '#f7f3ee',
  iris: '#2a1c16',
  glint: '#ffffff',
  hair: '#1d1714',
  hairHi: '#3a2a20',
  hairLo: '#100c0a',
  frame: '#6f6440',
  pants: '#2b3442',
  shoe: '#ecebe4',
  sole: '#b8b6ad',
  watch: '#1a1a1a',
  headset: '#22252c',
  cushion: '#3a3f4a',
  shell: '#d9d6c8',
  screen: '#8bac0f',
  screenInk: '#306230',
  dpad: '#1b1b1b',
  btn: '#7b1f4a',
  phone: '#1b1b1b',
  case: '#e05a8a',
  lens: '#111111',
  rec: '#ff3b3b'
}
const TEE: Record<Variant, string> = {
  dev: '#1f1f22',
  player: '#f4f4ef',
  creator: '#22306b'
}

const sq = (v: number) => v * v
const ell = (
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  cz: number,
  rx: number,
  ry: number,
  rz: number
) => sq((x - cx) / rx) + sq((y - cy) / ry) + sq((z - cz) / rz) <= 1
const supell = (
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  cz: number,
  rx: number,
  ry: number,
  rz: number,
  e: number
) =>
  Math.abs((x - cx) / rx) ** e +
    Math.abs((y - cy) / ry) ** e +
    Math.abs((z - cz) / rz) ** e <=
  1
const rbox = (
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  cz: number,
  hx: number,
  hy: number,
  hz: number,
  r: number
) => {
  const qx = Math.abs(x - cx) - hx + r,
    qy = Math.abs(y - cy) - hy + r,
    qz = Math.abs(z - cz) - hz + r
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) +
      Math.min(Math.max(qx, qy, qz), 0) -
      r <=
    0
  )
}
const seg = (
  x: number,
  y: number,
  z: number,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  r: number
) => {
  const abx = bx - ax,
    aby = by - ay,
    abz = bz - az
  const t = Math.max(
    0,
    Math.min(
      1,
      ((x - ax) * abx + (y - ay) * aby + (z - az) * abz) /
        (abx * abx + aby * aby + abz * abz)
    )
  )
  return Math.hypot(x - ax - abx * t, y - ay - aby * t, z - az - abz * t) <= r
}
const faceZ = (x: number, y: number) => {
  const k = 1 - Math.abs(x / 6.5) ** 2.6 - Math.abs((y - 15.6) / 6) ** 2.6
  return k > 0 ? 5.6 * k ** (1 / 2.6) : 0
}
const noise = (x: number, y: number, z: number) => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453
  return n - Math.floor(n)
}
const TUFTS: [number, number, number][] = [
  [-4.4, 20.6, -2.2],
  [-3.0, 21.3, 0.6],
  [-1.4, 21.6, -1.6],
  [0.2, 21.9, 1.4],
  [1.9, 21.7, -0.4],
  [3.4, 21.3, 1.8],
  [4.6, 20.6, -1.2],
  [-2.2, 21.5, 3.2],
  [1.2, 21.8, 3.6],
  [-0.4, 21.3, -3.4],
  [2.8, 20.8, -3.0],
  [-3.8, 20.6, 2.8],
  [-0.9, 22.0, 2.2],
  [2.6, 21.6, 3.0],
  [4.2, 20.9, 2.4]
]
const hairShade = (x: number, y: number, z: number) => {
  const n = noise(x, y, z)
  return n > 0.9 ? COL.hairHi : n < 0.08 ? COL.hairLo : COL.hair
}

export function colorAt(
  v: Variant,
  x: number,
  y: number,
  z: number,
  s: number
): string | null {
  const th = Math.max(0.5, s * 1.01)
  const ax = Math.abs(x)
  const hold = v !== 'dev'

  // glasses: open square frames that wrap just in front of the face, bridge, temples to the ears
  const zf = faceZ(Math.min(ax, 6.2), y) + 0.25
  if (z >= zf && z <= zf + th) {
    for (const sx of [-1, 1]) {
      const cx = sx * 2.9,
        cy = 14.6
      const outer = Math.abs(x - cx) <= 2.3 && Math.abs(y - cy) <= 1.7
      const inner = Math.abs(x - cx) <= 2.3 - th && Math.abs(y - cy) <= 1.7 - th
      if (outer && !inner) return COL.frame
    }
    if (ax <= 0.6 && y >= 16.3 - th && y <= 16.3) return COL.frame
    if (ax >= 5.2 && ax <= 6.55 + th && y >= 16.3 - th && y <= 16.3)
      return COL.frame
  }
  if (
    ax >= 6.55 &&
    ax <= 6.55 + th &&
    y >= 16.3 - th &&
    y <= 16.3 &&
    z >= 0.6 &&
    z <= 3.2
  )
    return COL.frame

  // headset with mic (dev mode)
  if (v === 'dev') {
    if (ax >= 6.9 && ax <= 8.4 && Math.hypot(y - 14.3, z - 0.3) <= 2.2)
      return ax <= 7.3 ? COL.cushion : COL.headset
    const r = Math.hypot(x, y - 15.5)
    if (
      y >= 15.8 &&
      r >= 8.3 &&
      r <= 8.3 + th * 1.6 &&
      Math.abs(z - 0.3) <= 0.55 + s / 2
    )
      return COL.headset
    if (ell(x, y, z, 3.2, 11.4, 6.9, 0.7, 0.6, 0.6)) return COL.headset
    if (seg(x, y, z, 8.0, 12.6, 1.8, 3.4, 11.4, 6.9, 0.35 + s / 2))
      return COL.cushion
  }

  // hands and arms
  if (hold) {
    for (const sx of [-1, 1]) {
      if (ell(x, y, z, sx * 3.9, 5.7, 3.6, 0.95, 1.0, 0.9)) return COL.skin
    }
    if (v === 'player' && rbox(x, y, z, 0, 6.4, 3.7, 2.9, 2.3, 0.5, 0.35)) {
      if (z > 3.9) {
        if (ax <= 2.0 && y >= 6.8 && y <= 8.2)
          return Math.abs(ax - 0.8) <= 0.3 && Math.abs(y - 7.7) <= 0.3
            ? COL.screenInk
            : COL.screen
        if (
          (Math.abs(x + 1.6) <= 0.9 && Math.abs(y - 5.3) <= 0.3) ||
          (Math.abs(x + 1.6) <= 0.3 && Math.abs(y - 5.3) <= 0.9)
        )
          return COL.dpad
        if (
          Math.hypot(x - 1.0, y - 5.0) <= 0.5 ||
          Math.hypot(x - 2.0, y - 5.6) <= 0.5
        )
          return COL.btn
      }
      return COL.shell
    }
    if (v === 'creator' && rbox(x, y, z, 0, 6.2, 3.6, 3.0, 1.6, 0.4, 0.3)) {
      if (z > 3.7) {
        if (
          Math.hypot(x + 2.1, y - 7.0) <= 0.45 ||
          Math.hypot(x + 2.1, y - 5.9) <= 0.45 ||
          Math.hypot(x + 1.1, y - 7.0) <= 0.45
        )
          return COL.lens
        if (Math.hypot(x - 2.2, y - 7.1) <= 0.35) return COL.rec
        return COL.case
      }
      return COL.phone
    }
    for (const sx of [-1, 1]) {
      if (seg(x, y, z, sx * 5.1, 8.0, 0, sx * 5.0, 6.0, 0.2, 0.95))
        return COL.skin
      if (seg(x, y, z, sx * 5.0, 5.9, 0.2, sx * 4.2, 5.6, 3.2, 0.9)) {
        if (sx < 0 && z >= 1.9 && z <= 2.5 + s / 2) return COL.watch
        return COL.skin
      }
    }
  }

  // hair: short tapered sides, uneven side-swept fringe, swept-up volume on top-front, textured tufts
  if (supell(x, y, z, 0, 16.4, -0.3, 7.25, 7.0, 6.5, 2.6)) {
    const front = z > 2.2
    const edge = 18.5 + 0.22 * x + 0.3 * Math.sin(x * 1.9)
    const top = front ? y > edge : y > 17.4
    const side = ax > 5.7 && y > 16.8 && z < 3.8
    const back = z < -2.0 && y > 10.8
    if (top || side || back) return hairShade(x, y, z)
  }
  if (ell(x, y, z, 0.4, 21.9, 3.0, 5.6, 2.2, 3.2)) return hairShade(x, y, z)
  for (const [tx, ty, tz] of TUFTS) {
    if (ell(x, y, z, tx, ty + 0.7, tz, 1.7, 1.3, 1.7)) return hairShade(x, y, z)
  }

  // nose, then face painted onto the head
  if (rbox(x, y, z, 0, 13.6, 5.6, 0.55, 0.9, 0.5, 0.2)) return COL.nose
  if (supell(x, y, z, 0, 15.6, 0, 6.5, 6.0, 5.6, 2.6)) {
    if (z > 3.5) {
      if (ax >= 1.7 && ax <= 5.2 && y >= 17.0 && y <= 17.8 + 0.08 * (ax - 1.7))
        return COL.hair
      // open eyes: white, dark iris with a little glint, lash line on top
      const hx = x - Math.sign(x) * 3.0,
        ey = y - 14.55
      if (sq(hx / 0.95) + sq(ey / 0.62) <= 1) {
        if (ey > 0.62 * Math.sqrt(Math.max(0, 1 - sq(hx / 0.95))) - 0.22)
          return COL.eye
        if (Math.hypot(hx + 0.18, ey - 0.16) <= 0.16) return COL.glint
        if (Math.hypot(hx, ey + 0.02) <= 0.5) return COL.iris
        return COL.sclera
      }
      if (ax <= 1.9 && y >= 11.0 && y <= 11.6) return COL.lip
      if (ax <= 1.5 && y > 11.6 && y <= 12.0) return COL.lipTop
    }
    return COL.skin
  }
  for (const sx of [-1, 1])
    if (ell(x, y, z, sx * 6.5, 14.2, 0.4, 0.8, 1.4, 1.0)) return COL.skin
  if (ax <= 1.6 && Math.abs(z - 0.3) <= 1.6 && y >= 9.3 && y <= 10.5)
    return COL.skin

  // dev mode: arms down, watch on the left wrist
  if (v === 'dev') {
    for (const sx of [-1, 1]) {
      if (ell(x, y, z, sx * 5.2, 3.6, 0.3, 1.0, 1.0, 1.0)) return COL.skin
      if (seg(x, y, z, sx * 5.1, 7.6, 0, sx * 5.2, 4.2, 0.2, 0.95)) {
        if (sx < 0 && y >= 4.5 && y <= 5.2 + s / 2) return COL.watch
        return COL.skin
      }
    }
  }

  // tee, sleeves, legs, shoes
  for (const sx of [-1, 1])
    if (rbox(x, y, z, sx * 4.9, 8.6, 0, 1.0, 1.2, 1.3, 0.5)) return TEE[v]
  if (rbox(x, y, z, 0, 6.9, 0, 4.3, 2.9, 2.5, 1.0))
    return y > 9.0 && ax <= 1.4 && z > 1.0 ? COL.skin : TEE[v]
  for (const sx of [-1, 1]) {
    if (rbox(x, y, z, sx * 1.8, 2.4, 0, 1.3, 1.6, 1.4, 0.4)) return COL.pants
    if (rbox(x, y, z, sx * 1.8, 0.55, 0.6, 1.4, 0.55, 2.0, 0.4))
      return y < 0.3 ? COL.sole : COL.shoe
  }
  return null
}

// Sample the shapes on a grid of step s and keep only surface blocks.
