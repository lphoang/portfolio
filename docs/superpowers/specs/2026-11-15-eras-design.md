# Eras: two immersive themes for the portfolio

Date: 2026-11-15
Status: approved 2026-11-15
Builds on: `2026-11-15-portfolio-refresh-design.md` (the live site at leph.dev)

## Why

The owner doesn't like the light theme. He wants the site to have more personality: two very different "eras" he can flip between, with a fun transition. One is inspired by Van Gogh's *The Starry Night* (painted in 1889) and feels like the 1800s. The other is a dark, colorful-green computer terminal. The bio intro is also out of date.

## Goals

1. Two themes ("eras") replace light/dark mode:
   - **1889**: Starry Night painting, 1800s feel.
   - **Terminal**: a dark screen in many shades of green.
   - The light theme and the Game Boy Mint colors are retired.
2. A toggle in the navbar, labelled **1889 | >_**.
   - Switching sends a craft flying left to right across the screen.
   - The new era is revealed behind the craft, like a curtain.
3. Fully immersive in both eras: a living background, era-styled cards, era fonts, and the 3D figure dressed for the era.
4. A refreshed bio intro.

## Non-goals

- No light mode, and no following the system light/dark setting (both eras are dark).
- No content that differs per era (same pages, same text, same data).
- No sound.

## Anti-goals (would be a failure even if it works)

- Copying a specific game's or brand's look.
  - The terminal is a generic green terminal, not Cyberpunk 2077 or The Matrix branding.
  - The earlier no-Nintendo rule still applies.
- Long text that is hard to read, or text below WCAG AA contrast in either era.
- Motion for people who asked for less motion (`prefers-reduced-motion`).
- Background animation that keeps running in a hidden tab or in the inactive era, draining batteries.
- A transition, background or 3D failure that breaks the page.

## Approaches considered

How far each era goes (decided by the owner):

| | Option | Verdict |
|---|---|---|
| A | Colors and fonts only | Rejected: not enough personality |
| B | Plus a living background | Rejected: wanted more |
| C | Fully immersive: living background, era cards, era fonts, era outfits for the figure | **Chosen** |

How to build it (one sensible way):

| | Option | Verdict |
|---|---|---|
| 1 | Era colors and fonts as CSS tokens switched by `data-era` on `<html>`, the browser's View Transitions API for the curtain, and two small canvas backgrounds | **Chosen** |
| 2 | Separate page components per era | Rejected: every page twice, content edits twice |
| 3 | A theme library (e.g. next-themes) | Rejected: the existing no-flash script already does this; one more dependency for nothing |

## What was decided

Approved mockup: `2026-11-15-eras/eras-reference.html`. Open it in a browser and click **1889 | >_**. Its CSS and canvas code are the reference for every value below.

### The era setting

- Era is `'starry'` (shown as **1889**) or `'terminal'` (shown as **>_**).
- It is stored in `localStorage` under `era`. The old `theme` key is ignored.
- **The default on a first visit is the terminal.**
- The inline head script sets `data-era` on `<html>` before the page paints, so there's no flash. It keeps the `try/catch` around `localStorage`.
- `useIsDark` is replaced by a hook that returns the current era. The figure and backgrounds use it.

### The toggle and the transition

- **The toggle:** a pill with two segments, `1889` and `>_`, in the navbar where the theme button was.
  - The active segment is filled.
  - `aria-label` reads "Switch to the 1889 theme" or "Switch to the terminal theme".
  - Clicks during a transition are ignored.
- **The craft:**
  - Switching to 1889 sends a **Victorian airship**: canvas balloon with stitching, a gondola with lit windows, a red tail fin, and smoke puffs.
  - Switching to the terminal sends an original **green pixel-art spaceship**, drawn from a 16×10 map: body `#39ff6a`, wings `#c6ff3d`, cockpit `#2bffc6`, flame `#ffcc33`.
  - Both SVGs are in the mockup.
- **The curtain** (View Transitions API):
  - The craft element has `view-transition-name`. It sits off-screen left before the switch and off-screen right after it, so the browser flies it across.
  - The new page is revealed by animating `clip-path` from `inset(0 100% 0 0)` to `inset(0 0 0 0)`, and the old page doesn't animate.
  - Duration `1.6s`, easing `cubic-bezier(.45,.05,.55,.95)`, the same for the craft and the curtain.
- **With reduced motion:** the era switches instantly and no craft is shown.
- **Browsers without View Transitions:** the era switches instantly and the craft simply flies over the page, with no curtain.

### Era tokens

**Terminal:**

| Token | Value |
|---|---|
| background | `#030805` |
| text | `#d4ffe0` |
| muted text | `#7fcf98` |
| green (accent) | `#39ff6a` |
| lime | `#c6ff3d` |
| mint | `#2bffc6` |
| teal | `#19d3c5` |
| numbers | `#8dff5a` |
| badge | `#c6ff3d` on `#030805` |
| panel | `#06110a` |
| panel border | `#1f8a46` |

**1889:**

| Token | Value |
|---|---|
| sky | `#0a1a3f` |
| text on the sky | `#f3e9d2` |
| muted text on the sky | `#cdbf9c` |
| star yellow (accent) | `#f4d35e` |
| section labels | `#f1d98a` |
| paper | `#efe3c6` |
| ink on paper | `#3a2716` |
| muted ink | `#5b4329` |
| dates | `#7a5a32` |
| Prussian blue (headings, numbers) | `#1f3b70` |
| wax seal | radial `#c2463a` → `#8e2b20` → `#6b1c14`, text `#f6e7c8` |

- No gold anywhere in 1889.
- The chart bar colors are picked per era with the dataviz validator: a mid green on the terminal panel, and Prussian blue (or the nearest passing step) on paper.

### Fonts (Google Fonts via `next/font`)

| Use | Terminal | 1889 |
|---|---|---|
| Name, logo | VT323 | Playfair Display, italic 600 |
| Page text (intro, tagline) | IBM Plex Mono | Playfair Display (tagline italic) |
| Cards: titles | JetBrains Mono 800 | Special Elite |
| Cards: text, labels, nav links | IBM Plex Mono | Special Elite |
| Big numbers | VT323 | Special Elite |

The old fonts (Space Grotesk, Inter, Silkscreen, Doto) are removed.

### Page details per era

| | Terminal | 1889 |
|---|---|---|
| Name | glowing green, with a blinking `█` cursor | italic, soft star-glow |
| Tagline | prefixed with `$ echo ` | italic |
| Section labels | `> work_`, with a blinking `_` | uppercase, letter-spaced `WORK` |
| Cards | dark panel, green border and glow, a 3px stripe on the left (lime → green → mint → teal) | aged paper: fibers, deckled edges (SVG displacement filter), darker rims, drop shadow |
| Badge ("Coming soon") | lime chip | red wax seal |

- **The 1889 cards in Home lists** tilt slightly, alternating −0.5° / +0.4°. Dashboard cards stay straight so the charts read cleanly.
- **The 404 page** gets the same era styling.

### Backgrounds

**Terminal:**
- **Falling characters:** a canvas of the characters `01<>/{}[]=+*#$%&ABCDEF`, in the five greens, at 28% opacity, 16px, about 20 updates a second.
- **CRT effects:** a vignette, scanlines, a slow sweep band, and a rare 1-frame flicker.

**1889:**
- **The swirling sky:** a canvas of brush-stroke particles flowing around three vortices, in the painting's blues.
- **Stars and moon:** glowing, slowly pulsing stars, kept out of the middle text column, and a crescent moon top-right.
- **Silhouettes:** a dark cypress SVG on the left, and a village silhouette at the bottom with lit windows.

**Rules for both:**
- A background only animates in its own era, and stops while the tab is hidden.
- With reduced motion, each draws one still frame: no rain fall, no swirl motion, no sweep, flicker or blinking cursor.

### The 3D figure in each era

The props per page stay the same in both eras: headset on Home (terminal only), phone on Channels, handheld on Apps.

**1889:**
- **Top hat** `#16141a`:
  - Brim: an ellipse 7.4 × 6.8 at y 22.9.
  - Crown: an ellipse 4.7 × 4.3 up to y 29.4.
  - A burgundy band `#7a1f2b` at the bottom of the crown, 1.2 units tall.
- Hair above the brim is hidden, and **no headset**.
- Glasses dark-brown wire `#4a3424`.
- **Clothes:** coat `#3b2a20` replaces the tee, with a waistcoat `#6b4a2b`, a white shirt `#efe6d0` and a red tie `#7a1f2b` at the front.
- Boots `#2a1d16`.
- Lights: ambient `#9fb4ff` at 1.0, key light `#ffe2a8` at 1.9.

**Terminal:**
- **Jacket** `#0b140e` replaces the tee, with green trim `#39ff6a` and a lime chest stripe `#c6ff3d`.
- Green glasses `#39ff6a`, green soles, and a mint streak in the hair `#2bffc6`.
- Lights: ambient white at 0.95, key `#e0ffe8` at 1.5, green rim light `#39ff6a` at 1.3 from behind-left.

**Placement rules** (the exact rules are `colorAtEra` in the mockup; port it unchanged, on top of the existing model):
- 1889 waistcoat: front, |x| ≤ 2.6, below y 8.6.
- 1889 shirt: front, |x| ≤ 1.1.
- 1889 tie: front, |x| ≤ 1.3, y 8.4–9.4.
- Terminal trim: above y 9.3 or |x| > 4.35.
- Terminal stripe: y 6.9–7.5.
- Terminal hair streak: x 1.2–3.4, front, above y 18.2.

**Baked data:**
- Six files: `public/figures/<variant>-<era>.json`.
- The grid is now 30.4 units tall so the hat fits, and the camera shows 34 units instead of 31.
- The figure loads the file for the current era, and loads the other era's file once the page is idle, so a switch is instant.

**Glow behind the figure:**
- 1889: soft moonlight `rgba(247,228,139,.28)`.
- Terminal: green `rgba(57,255,106,.2)` fading to mint.

### Favicon

- **The old favicon goes.** `public/images/alien.svg` is a stock icon from SVG Repo: off-brand, with an unclear license.
- **Two original SVG favicons, one per era:**
  - Terminal: a dark `#030805` rounded square with a green `>_`, drawn with lines (no font).
  - 1889: a `#0a1a3f` rounded square with a `#f4d35e` crescent moon and a small star.
- **Behavior:**
  - The page metadata points at the terminal icon (the default era).
  - The head script and the toggle swap the icon's `href` to match the current era.

### Bio

- Tagline stays: "Developer, dreamer, everything all at once."
- The intro paragraph is removed (the owner's call after seeing it live); the tagline carries the hero.
- Hobbies are unchanged.

### Testing

**Unit tests:**
- The era rule: a stored valid era wins, and otherwise it's the terminal, including when storage throws.
- Era outfits on the baked data:
  - 1889 Home has the hat color, the tie and the brown glasses, and no headset colors.
  - Terminal Home has the headset, the green trim and the green glasses.
  - All six files are step 0.25, have 10k–35k cubes, and are under 150 KB gzipped.
- A contrast check on every era text pair: on the background, on the panel, and on paper.

**Browser checks before done:**
- Both eras on Home, Channels, Apps and 404, at phone and desktop widths.
- The transition in both directions.
- Reduced motion.
- No View Transitions support.
- No WebGL.
- The background stops in a hidden tab.

## Calls made by the designer (owner can change)

- The default era on a first visit is the terminal.
- The props stay the same in both eras. The headset disappears in 1889, because the hat replaces it.
- In 1889, the glasses are dark-brown wire, not brass (no gold anywhere).
- The crafts: an airship to 1889, a pixel spaceship to the terminal.
- Stars stay out of the middle column.
- The storage key is `era`, and the toggle label is "1889 | >_".
- Dashboard paper cards don't tilt.
- The intro text above. Hobbies unchanged.

## Left to the builder

- Canvas tuning: particle counts, speeds, fade rates.
- The component structure.
- The exact chart bar colors, after running the validator.
- How the reduced-motion still frames are painted.
