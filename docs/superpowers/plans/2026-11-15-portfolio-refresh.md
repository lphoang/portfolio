# Portfolio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a Next.js 16 app-router site with Home, Channels and Apps pages, live YouTube stats, a "44-bit" Game Boy Mint design, and a baked 3D voxel figure of the owner on every page.

**Architecture:** Server components render all pages; YouTube stats are fetched on the server with a 6-hour revalidate, so the API key never reaches the browser. Content lives in typed data files under `src/data/`. The voxel figure is baked ahead of time by a script into `public/figures/<outfit>.json` and drawn in the browser by a small React Three Fiber component.

**Tech Stack:** Next.js 16.4, React 19.3, TypeScript 6.0, Tailwind CSS 4.3, three 0.187 + @react-three/fiber 9.8, Vitest 5, tsx, ESLint (flat config), Prettier 3.

**Spec:** `docs/superpowers/specs/2026-11-15-portfolio-refresh-design.md` (approved). Mockups: `docs/superpowers/specs/2026-11-15-portfolio-refresh/figure-reference.html` and `theme-reference.html`.

## Global Constraints

- Install from public npm: the repo gets an `.npmrc` with `registry=https://registry.npmjs.org/` (`~/.npmrc` points to a company mirror that is unreachable off-network). Node `>=20.9`.
- Versions: `next@^16.4`, `react@~19.3` and `react-dom@~19.3` (R3F 9.8 needs `<19.4`), `typescript@~6.0.3` (**not 7**: TS 7 has no JS compiler API, which Next's type check and typescript-eslint need), `tailwindcss@^4.3` + `@tailwindcss/postcss`, `three@^0.187`, `@react-three/fiber@^9.8`, `server-only`, `vitest@^5`, `tsx`, `eslint` + `eslint-config-next@^16.4` (use `eslint@^10`; drop to `eslint@^9` only if `npm run lint` crashes inside a plugin), `prettier@^3` + `@trivago/prettier-plugin-sort-imports@^6`.
- Prettier style stays: `semi: false`, `singleQuote: true`, `trailingComma: 'none'`, `arrowParens: 'avoid'`, `importOrder: ['^@/(.*)$', '^[./]']`, import separation and specifier sorting on.
- Path alias `@/*` → `src/*`.
- `YOUTUBE_API_KEY` is server-only: never `NEXT_PUBLIC_`, never logged, never inside a URL that is logged. `src/lib/youtube.ts` starts with `import 'server-only'`.
- Revalidate time for YouTube data and the pages that use it: `21600` seconds (6 hours).
- Copy, exactly: name `Le Phuoc Hoang`; tagline `Developer, dreamer, everything all at once.`; fallback message `Stats are taking a break`; hidden subscribers show `hidden`; app badge `Coming soon`.
- Color tokens and fonts exactly as the spec's "Visual design" section. Long text is always Inter.
- Figure: cube size `0.25`; outfit per page Home → `dev`, Channels → `creator`, Apps → `player`.
- No Nintendo / Pokémon names, logos or characters in visuals or alt text.
- Never stage `Profile.pdf`. Never commit `.env.local`.
- No ticket IDs in code or comments. Keep code plain (KISS).
- Commits use the repo's style (`Feat: …`, `Fix: …`, `Chore: …`) and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- A video with likes or comments turned off (no `likeCount` / `commentCount` in the API response) shows `—`, not `0` or `NaN`. Test: Task 4.
- A channel with no uploads yet (empty playlist) shows its totals and "No videos yet" instead of an empty chart or a crash. Tests: Task 4 and Task 5.
- A browser without WebGL (old phone, blocked GPU) still shows the page with the same-size placeholder where the figure would be. Covered by Task 7's `fallback`, checked by hand in Task 8.
- A browser where `localStorage` throws (private mode, blocked storage) still gets the system theme and no flash. Test: Task 2 (`resolveTheme`).
- Long video titles, including Vietnamese ones, on a 360px phone wrap or clamp to two lines with no sideways scrolling. Checked by hand in Task 8.

---

## File map

| File | Responsibility |
|---|---|
| `.npmrc`, `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `prettier.config.js`, `postcss.config.mjs`, `vitest.config.ts` | Toolchain |
| `src/app/layout.tsx`, `src/app/globals.css` | Fonts, theme tokens, theme script, navbar shell |
| `src/app/page.tsx`, `src/app/channels/page.tsx`, `src/app/apps/page.tsx`, `src/app/not-found.tsx` | Pages |
| `src/lib/theme.ts` | `resolveTheme` + the inline theme script |
| `src/lib/format.ts` | Number and date formatting |
| `src/lib/youtube.ts` | YouTube fetch + mapping (server only) |
| `src/data/profile.ts`, `src/data/work.ts`, `src/data/channels.ts`, `src/data/apps.ts` | Content |
| `src/components/*.tsx` | Navbar, ThemeToggle, SectionLabel, Timeline, AppCard, Stat, ViewsChart, ChannelDashboard, ChannelTeaser |
| `src/figure/model.ts` | Shape model ported from the mockup |
| `src/figure/voxelize.ts` | Shapes → surface cubes (`FigureData`) |
| `src/figure/pose.ts` | Sway / hop / reduced-motion math |
| `src/figure/VoxelFigure.tsx`, `src/figure/Figure.tsx` | R3F renderer and lazy wrapper |
| `scripts/bake-figures.ts` → `public/figures/{dev,player,creator}.json` | Baked figure data |

---

### Task 1: Toolchain reset and empty app

**Files:**
- Create: `.npmrc`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `vitest.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `next.config.test.ts`
- Modify: `package.json`, `tsconfig.json`, `prettier.config.js`, `.gitignore`, `.env.example`, `README.md`
- Delete: `src/pages/`, `src/components/`, `src/shared/`, `src/libs/`, `src/styles/`, `next.config.js`, `nodemon.json`, `tsconfig.server.json`, `.eslintrc.json`, `public/images/avatar.png`, `public/images/logo.svg`, `public/images/light-mode.svg`, `public/images/dark-mode.svg`, `package-lock.json` (regenerated)
- Keep untouched: `public/images/alien.svg` (favicon). Leave the already-unused `works.jpg`, `dev_icon.png`, `ImageToStl.com_smile.glb` alone and list them in the final report.

**Interfaces:**
- Produces: scripts `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `figures` (`tsx scripts/bake-figures.ts`), `format` (`prettier --write .`); alias `@/`; redirects config.

- [ ] **Step 1: Branch.** `git checkout -b refresh-2026`. Run `git status` and confirm `Profile.pdf` is untracked and stays unstaged.
- [ ] **Step 2: Clean out the old app.** Delete the files listed above. Add `.npmrc` with `registry=https://registry.npmjs.org/` and a one-line comment explaining why. Add `Profile.pdf` and `.env*.local` to `.gitignore` (keep existing entries). Set `.env.example` to exactly `YOUTUBE_API_KEY=`.
- [ ] **Step 3: Install.** Replace `package.json` dependencies with the Global Constraints list (remove Chakra, Emotion, framer-motion, `@next/font`, react-icons), set the scripts above and `"engines": { "node": ">=20.9" }`. Run `npm install`. Expected: no peer-dependency errors.
- [ ] **Step 4: Config files.** `tsconfig.json`: Next 16 defaults + `strict`, `paths: { "@/*": ["./src/*"] }`. `eslint.config.mjs`: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`, ignores `.next/**`, `public/figures/**`, `docs/**`, `.superpowers/**`. `postcss.config.mjs`: `@tailwindcss/postcss`. `vitest.config.ts`: node environment, `esbuild.jsx = 'automatic'`, alias `@` → `src`. `prettier.config.js`: the style in Global Constraints with `importOrder: ['^@/(.*)$', '^[./]']`. Minimal `layout.tsx` (html/body, imports `globals.css` containing `@import 'tailwindcss';`) and `page.tsx` rendering `<h1>Le Phuoc Hoang</h1>`.
- [ ] **Step 5: Write the failing redirect test** in `next.config.test.ts`:

```ts
import config from './next.config'

test('old works and posts links redirect home', async () => {
  expect(await config.redirects!()).toEqual([
    { source: '/works/:path*', destination: '/', permanent: true },
    { source: '/posts/:path*', destination: '/', permanent: true }
  ])
})
```

- [ ] **Step 6: Run it.** `npm test` → FAIL (`redirects` undefined).
- [ ] **Step 7: Add `redirects()`** to `next.config.ts` returning exactly those two entries.
- [ ] **Step 8: Verify the toolchain.** `npm test && npm run typecheck && npm run lint && npm run build` → all pass. If lint crashes inside a plugin under ESLint 10, pin `eslint@^9` and rerun.
- [ ] **Step 9: README.** Replace with: what the site is, the scripts, `YOUTUBE_API_KEY` (put it in `.env.local` locally, Vercel project settings in production), "content lives in `src/data/`", "regenerate figures with `npm run figures`".
- [ ] **Step 10: Commit** (stage paths explicitly; never `git add -A`): `Chore: move to Next.js 16 app router, Tailwind and Vitest`.

---

### Task 2: Theme, fonts and site shell

**Files:**
- Create: `src/lib/theme.ts`, `src/lib/theme.test.ts`, `src/components/Navbar.tsx`, `src/components/ThemeToggle.tsx`, `src/components/SectionLabel.tsx`, `src/app/not-found.tsx`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: `resolveTheme(stored: string | null, systemDark: boolean): 'light' | 'dark'`; `themeScript: string`; Tailwind color utilities `bg`, `panel`, `line`, `ink`, `muted`, `accent`, `num`, `badge`, `badge-ink` (e.g. `bg-panel`, `text-muted`, `border-line`); font utilities `font-display` (Space Grotesk), `font-sans` (Inter), `font-label` (Silkscreen), `font-num` (Doto); utility `card` = `bg-panel border border-line rounded-[6px]` (the spec's 1px borders with 6px corners, used for every box); dark variant via `.dark` on `<html>`; `<SectionLabel>work</SectionLabel>` renders `// work`.

- [ ] **Step 1: Write the failing test** `src/lib/theme.test.ts`:

```ts
import { resolveTheme } from './theme'

test('stored choice wins over the system', () => {
  expect(resolveTheme('dark', false)).toBe('dark')
  expect(resolveTheme('light', true)).toBe('light')
})
test('no or unknown stored value follows the system', () => {
  expect(resolveTheme(null, true)).toBe('dark')
  expect(resolveTheme(null, false)).toBe('light')
  expect(resolveTheme('purple', true)).toBe('dark')
})
```

- [ ] **Step 2: Run** `npx vitest run src/lib/theme.test.ts` → FAIL (module not found).
- [ ] **Step 3: Implement `src/lib/theme.ts`.** `resolveTheme` as tested. `themeScript` is an inline IIFE string for `<head>`: read `localStorage.getItem('theme')` inside `try/catch` (treat a throw as `null`), read `matchMedia('(prefers-color-scheme: dark)').matches`, apply the same rule, and toggle class `dark` on `document.documentElement`. Storage key: `theme`.
- [ ] **Step 4: Run the test** → PASS.
- [ ] **Step 5: Tokens and fonts.** In `globals.css`: `@custom-variant dark (&:where(.dark, .dark *));`, CSS variables on `:root` and `.dark` with the spec's exact light and dark values, exposed through `@theme inline` as the color names above; body uses `bg`/`ink` plus the dot grid `radial-gradient(var(--dot) 1px, transparent 1px)` at `8px 8px`; define the `card` utility with `@utility`. In `layout.tsx`: load Space Grotesk (500, 700), Inter (400, 600), Silkscreen (400), Doto (900) with `next/font/google` as CSS variables wired to the font utilities; `<html suppressHydrationWarning>`; `<script dangerouslySetInnerHTML={{ __html: themeScript }} />` in `<head>`; metadata `title: { default: 'Le Phuoc Hoang', template: '%s · Le Phuoc Hoang' }`, a one-sentence description, `icons: '/images/alien.svg'`; body renders `<Navbar />` and a centered `max-w-3xl` main with side padding.
- [ ] **Step 6: Components.** `Navbar`: logo `leph` (`font-display`, accent) linking `/`; links `Channels` → `/channels`, `Apps` → `/apps` in `font-label`, with the current page highlighted (`usePathname` in a small client part); `ThemeToggle` on the right. `ThemeToggle` (client): button with `aria-label="Switch to dark mode"` / `"Switch to light mode"`, toggles the `dark` class and writes `localStorage` inside `try/catch`. `SectionLabel`: `font-label text-accent`, renders `// {children}`. `not-found.tsx`: heading "Not found", one line, link back home; no figure.
- [ ] **Step 7: Verify.** `npm test && npm run typecheck && npm run lint && npm run build` → pass. `npm run dev`, open `/` and `/nope`: theme toggles, survives a reload, no flash of the wrong theme.
- [ ] **Step 8: Commit:** `Feat: Game Boy Mint theme, fonts and navbar`.

---

### Task 3: Content and the static parts of Home and Apps

**Files:**
- Create: `src/data/profile.ts`, `src/data/work.ts`, `src/data/apps.ts`, `src/components/Timeline.tsx`, `src/components/Timeline.test.tsx`, `src/components/AppCard.tsx`, `src/app/apps/page.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `SectionLabel`, font and color utilities (Task 2).
- Produces:
  - `profile: { name: string; tagline: string; intro: string; born: { year: string; text: string }; hobbies: string[]; links: { label: string; text: string; url: string }[] }`
  - `type Role = { title: string; period: string }`, `type Job = { company: string; place: string; period: string; roles: Role[] }`, `work: Job[]`, `education: { degree: string; school: string; period: string }`
  - `type AppInfo = { name: string; blurb: string; status: 'Coming soon' }`, `apps: AppInfo[]`
  - `<Timeline jobs={Job[]} born={profile.born} />`, `<AppCard app={AppInfo} href?={string} />` (whole card is a link when `href` is given).

- [ ] **Step 1: Data files**, values copied exactly from the spec:
  - `profile`: name, tagline, intro (the spec's draft text), `born: { year: '1999', text: 'Born in Hue, Vietnam' }`, hobbies `['Reading detective books', 'Adventure movies', 'Coding', 'Pokémon (games and anime)']`, links GitHub (`@lphoang`, `https://github.com/lphoang`) and LinkedIn (`Le Phuoc Hoang`, `https://www.linkedin.com/in/le-phuoc-hoang-10933b194/`).
  - `work`, newest first: mgm technology partners Vietnam (`2025 – now`, Software Engineer, `Jun 2025 – now`); mesoneer (`2023 – 2025`, Software Engineer, `Feb 2023 – May 2025`); FPT Software (`2021 – 2023`, roles Frontend Developer `May 2022 – Jan 2023`, Back End Developer `Oct 2021 – Jan 2023`, Back End Developer (intern) `Jun – Jul 2021`). All `place: 'Da Nang'`.
  - `education`: `Engineering degree`, `Danang University of Science and Technology`, `2017 – 2022`.
  - `apps`: one entry, `2Eat`, the spec's one line, `Coming soon`.
- [ ] **Step 2: Write the failing test** `src/components/Timeline.test.tsx` using `renderToStaticMarkup` from `react-dom/server`:

```tsx
test('jobs render newest first and the birth line comes last', () => {
  const html = renderToStaticMarkup(<Timeline jobs={work} born={profile.born} />)
  const order = ['mgm technology partners Vietnam', 'mesoneer', 'FPT Software', 'Born in Hue, Vietnam'].map(t => html.indexOf(t))
  expect(order.every(i => i >= 0)).toBe(true)
  expect([...order].sort((a, b) => a - b)).toEqual(order)
  expect(html).toContain('Back End Developer (intern)')
})
```

- [ ] **Step 3: Run** → FAIL. **Step 4: Implement `Timeline`** (period in `font-label text-muted`, company in `font-display`, roles listed under the company in Inter; the birth line as the final row) → **Step 5: run** → PASS.
- [ ] **Step 6: `AppCard`**: panel card, `font-display` name, blurb in Inter, badge `bg-badge text-badge-ink font-label` reading `Coming soon`.
- [ ] **Step 7: Pages.** Home (`src/app/page.tsx`), in this order: hero (h1 name in `font-display`, tagline, intro; leave a clearly empty slot at the top for the figure, filled in Task 7), `// work` Timeline, `// education`, `// building` with `<AppCard app={apps[0]} href="/apps" />`, `// i ♥` hobbies list, `// connect` profile links (channels are added in Task 5). Apps page: metadata title `Apps`, `// apps` label, `<AppCard app={apps[0]} />` (no link).
- [ ] **Step 8: Verify** `npm test && npm run typecheck && npm run lint && npm run build`; open `/` and `/apps` at 360px and desktop widths in both themes.
- [ ] **Step 9: Commit:** `Feat: home work history and apps page`.

---

### Task 4: YouTube data layer

**Files:**
- Create: `src/lib/format.ts`, `src/lib/format.test.ts`, `src/lib/youtube.ts`, `src/lib/youtube.test.ts`, `src/data/channels.ts`

**Interfaces:**
- Produces:
  - `formatCompact(n: number): string`, `formatFull(n: number): string`, `formatDate(iso: string): string`
  - `type ChannelConfig = { id: string; handle: string; url: string; title: string; blurb: string }` and `channels: ChannelConfig[]`, both in `src/data/channels.ts`; every other type below lives in `src/lib/youtube.ts`
  - `type VideoStats = { id: string; title: string; url: string; publishedAt: string; views: number; likes: number | null; comments: number | null }`
  - `type ChannelStats = { title: string; avatarUrl: string | null; subscribers: number | null; views: number; videos: number; latest: VideoStats[] }`
  - `getChannelStats(channel: ChannelConfig, apiKey?: string, fetchImpl?: typeof fetch): Promise<ChannelStats | null>`. `apiKey` defaults to `process.env.YOUTUBE_API_KEY`. `null` means "show the fallback".

- [ ] **Step 1: Resolve the channel IDs** (no API key needed). For each URL, `curl -sL -H 'Accept-Language: en' -b 'SOCS=CAI' <url>` and extract `"externalId":"UC…"` and the `og:title`. Expected: `@mike.thedreamER18` → title containing `mike.thedreamER`; `@codingmate` → title matching the coding mate. If either check fails, stop and ask the owner for the ID (YouTube Studio → Settings → Channel → Advanced settings).
- [ ] **Step 2: `src/data/channels.ts`** with the resolved IDs, handles `@mike.thedreamER18` / `@codingmate`, URLs, titles `mike.thedreamER` / `The coding mate`, and the spec's one-liners.
- [ ] **Step 3: Write the failing tests.** `format.test.ts`:

```ts
expect(formatCompact(0)).toBe('0')
expect(formatCompact(950)).toBe('950')
expect(formatCompact(12_400)).toBe('12.4K')
expect(formatCompact(1_200_000)).toBe('1.2M')
expect(formatFull(12_400)).toBe('12,400')
expect(formatDate('2026-11-03T10:00:00Z')).toBe('Nov 3, 2026')
```

`youtube.test.ts`, with a fake `fetchImpl` that answers `/channels`, `/playlistItems` and `/videos` by URL path from small fixture objects:
  - `returns totals and the latest uploads in playlist order`: subscribers, views and videos parsed from the strings YouTube sends; `latest[0].url === 'https://www.youtube.com/watch?v=<id>'`.
  - `hidden subscriber count becomes null` (`hiddenSubscriberCount: true`).
  - `missing likeCount and commentCount become null` (not `0`).
  - `no uploads gives an empty list` (playlist `items: []`; no `/videos` call made).
  - `missing key returns null without calling fetch`.
  - `a non-OK response returns null` (403 quota error).
  - `a thrown network error returns null`.
  - `errors never log the key`: spy `console.error`, use key `secret-key`, force a 403; assert no logged argument contains `secret-key`.
- [ ] **Step 4: Run** `npx vitest run src/lib` → FAIL.
- [ ] **Step 5: Implement `format.ts`** with `Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })`, `Intl.NumberFormat('en')`, and `Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })`.
- [ ] **Step 6: Implement `youtube.ts`** (`import 'server-only'` first). Base `https://www.googleapis.com/youtube/v3`. Calls: `channels?part=snippet,statistics,contentDetails&id=<id>`, then `playlistItems?part=contentDetails&maxResults=10&playlistId=<uploads>`, then (only if there are items) `videos?part=snippet,statistics&id=<comma ids>`. Every fetch gets `{ next: { revalidate: 21600 } }`. Keep the playlist order. Avatar is `snippet.thumbnails.default.url`. Any failure: `console.error` a message naming the channel and the HTTP status only, then return `null`.
- [ ] **Step 7: Run** → PASS. `npm run typecheck && npm run lint`.
- [ ] **Step 8: Commit:** `Feat: YouTube channel stats with server-side caching`.

---

### Task 5: Channels page and Home teasers

**Files:**
- Create: `src/components/Stat.tsx`, `src/components/ViewsChart.tsx`, `src/components/ChannelDashboard.tsx`, `src/components/ChannelDashboard.test.tsx`, `src/components/ChannelTeaser.tsx`, `src/app/channels/page.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `channels`, `getChannelStats`, `ChannelStats`, `VideoStats`, `formatCompact`, `formatFull`, `formatDate` (Task 4); `SectionLabel` (Task 2).
- Produces: `<Stat label value={number | null} />` (`null` → `hidden`; Doto number, short form, `title` with the full number); `<ViewsChart videos={VideoStats[]} />` (SVG, one `<rect>` per video, oldest left; `role="img"`, `aria-label="Views of the latest N videos"`; each bar has a `<title>`); `<ChannelDashboard channel stats />`; `<ChannelTeaser channel stats />`.

- [ ] **Step 1: Write the failing tests** `ChannelDashboard.test.tsx` (`renderToStaticMarkup`):
  - `null stats shows the fallback and the channel link`: contains `Stats are taking a break` and `href="https://www.youtube.com/@codingmate"`.
  - `hidden subscribers read "hidden"`.
  - `three videos draw three bars and list three titles`: count of `<rect` is 3.
  - `no uploads shows "No videos yet" and no chart`: no `<svg`.
  - `a video with likes off shows —`.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** the four components. Dashboard layout: header (avatar via a plain 48px `<img>`, with a short comment explaining why it skips the image optimizer; title in `font-display`; blurb; link "Open on YouTube"); three `Stat`s (`subscribers`, `views`, `videos`); `// latest uploads` label; `ViewsChart`; list rows with the title linking to the video (`line-clamp-2`, `break-words`), date, views, likes, comments (`—` for `null`). `ChannelTeaser`: one row with the title and `<n> subscribers` (nothing extra when stats are `null` or hidden), linking to `/channels`. **Step 4: Run** → PASS.
- [ ] **Step 5: Pages.** `channels/page.tsx`: `export const revalidate = 21600`, metadata title `Channels`, `// channels` label, `await Promise.all(channels.map(c => getChannelStats(c)))`, one dashboard per channel (empty slot at the top for the figure). Home: `export const revalidate = 21600`; add `// on youtube` with one `ChannelTeaser` per channel above `// building`; add both channels to `// connect`.
- [ ] **Step 6: Verify** `npm test && npm run typecheck && npm run lint && npm run build`. The build output lists `/` and `/channels` with a 6h revalidate. Without a key, `/channels` shows both fallbacks. With a key in `.env.local` (only if the owner provides one), real numbers appear.
- [ ] **Step 7: Commit:** `Feat: channel dashboards and home teasers`.

---

### Task 6: Figure model and baked data

**Files:**
- Create: `src/figure/model.ts`, `src/figure/voxelize.ts`, `src/figure/voxelize.test.ts`, `scripts/bake-figures.ts`, `public/figures/dev.json`, `public/figures/player.json`, `public/figures/creator.json` (generated)

**Interfaces:**
- Produces:
  - `type Variant = 'dev' | 'player' | 'creator'`
  - `colorAt(v: Variant, x: number, y: number, z: number, s: number): string | null`
  - `type FigureData = { step: number; origin: [number, number, number]; groups: { color: string; cells: number[] }[] }`. `cells` is a flat list of grid indices `i, j, k`; a cube's center is `origin + (index + 0.5) * step`.
  - `voxelize(v: Variant, step: number): FigureData`, surface cubes only.
  - `npm run figures` writes `public/figures/<variant>.json` at step `0.25`.

- [ ] **Step 1: Port the model.** Copy `COL`, `TEE`, `sq`, `ell`, `supell`, `rbox`, `seg`, `faceZ`, `noise`, `TUFTS`, `hairShade` and `colorAt` from `figure-reference.html` (lines 47–190) into `model.ts` and add types. **Do not change any number or color.**
- [ ] **Step 2: Write the failing tests** `voxelize.test.ts` (step `0.5` for speed unless stated):
  - `same input, same output`: `voxelize('dev', 0.5)` deep-equals a second run.
  - `only surface cubes are kept`: no cell has all six neighbours present.
  - `each outfit has its own props`: dev has `#22252c` (headset) and no `#ff3b3b`; creator has `#ff3b3b` and `#e05a8a`; player has `#8bac0f` and `#d9d6c8`; all three have `#6f6440` (glasses).
  - `baked files are small`: for each `public/figures/<v>.json`, `step === 0.25`, total cubes between 10,000 and 30,000, and `gzipSync(file).length < 150_000`.
- [ ] **Step 3: Run** → FAIL. **Step 4: Implement `voxelize`.** Grid origin `(-9.6, -0.2, -7.6)`, extent `19.2 × 25.8 × 16.4`, sample cell centers, keep a cell only if a neighbour is empty or outside the grid. This is the same algorithm as the reference `voxelize`. Groups appear in the order their color is first met.
- [ ] **Step 5: `scripts/bake-figures.ts`** writes compact JSON for the three variants at `0.25` and prints each file's cube count and size. Run `npm run figures`. **Step 6: Run the tests** → PASS.
- [ ] **Step 7: Commit:** `Feat: voxel figure model and baked outfits`.

---

### Task 7: Figure renderer on every page

**Files:**
- Create: `src/figure/pose.ts`, `src/figure/pose.test.ts`, `src/figure/VoxelFigure.tsx`, `src/figure/Figure.tsx`
- Modify: `src/app/page.tsx`, `src/app/channels/page.tsx`, `src/app/apps/page.tsx`

**Interfaces:**
- Consumes: `Variant`, `FigureData` (Task 6); `public/figures/<variant>.json`.
- Produces:
  - `pose(i: { t: number; offset: number; lastInput: number; hopAt: number; phase: number; reducedMotion: boolean }): { rotationY: number; y: number }`
  - `<Figure variant={Variant} label={string} />` (client)

- [ ] **Step 1: Write the failing tests** `pose.test.ts`. Constants: sway `0.6` rad, period `t / 1600`, idle after `2500` ms, hop `450` ms high `2.5`, bob `0.15 * sin(t / 500 + phase)`.
  - `reduced motion: only the drag offset, no movement`: `{ rotationY: offset, y: 0 }` at several `t` values, including mid-hop.
  - `idle sways around the offset`: `t - lastInput > 2500` → `rotationY ≈ offset + 0.6 * sin(t / 1600 + phase)`.
  - `recent drag holds still`: `t - lastInput < 2500` → `rotationY === offset`.
  - `hop peaks halfway`: `t = hopAt + 225` → `y ≈ 2.5 + bob`.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement `pose`** → **Step 4: run** → PASS.
- [ ] **Step 5: `VoxelFigure`** (client). Props `{ variant: Variant }`. Fetch `/figures/<variant>.json`. Use `<Canvas orthographic dpr={[1, 2]} gl={{ antialias: false }} fallback={null}>` with the camera at `(14, 12, 34)` looking at the origin, zoom = canvas size / 31. Draw one `InstancedMesh` per color group (`BoxGeometry(step)`, `MeshLambertMaterial`), centered on its bounding box. Lights: ambient `1.15`, directional `1.7` at `(8, 14, 12)`; in dark mode (watch the `dark` class on `<html>`) ambient `1.35` and directional `2.0`. In `useFrame`: drag offset decays ×0.97 per frame once idle, then apply `pose`. Pointer handling: horizontal drag changes the offset by `dx * 0.012`; a click with less than 4px of movement sets `hopAt`. Read reduced motion from `matchMedia('(prefers-reduced-motion: reduce)')`. Canvas style `touch-action: pan-y`.
- [ ] **Step 6: `Figure`** (client): a fixed-size square (`size-64 sm:size-72`), `role="img"` and `aria-label={label}`. In dark mode it has a spotlight background, `radial-gradient(circle, var(--panel) 0%, transparent 70%)`. It loads `VoxelFigure` with `next/dynamic` (`ssr: false`), and the loading state is the same empty square.
- [ ] **Step 7: Place the figures.** Home: `variant="dev"`, label `3D figure of Hoang wearing a headset`. Channels: `variant="creator"`, label `3D figure of Hoang filming with a phone`. Apps: `variant="player"`, label `3D figure of Hoang holding a handheld game console`.
- [ ] **Step 8: Verify** `npm test && npm run typecheck && npm run lint && npm run build`; the first-load JS for `/` stays reasonable (three and R3F only load with the figure chunk). In the browser: sway, drag, click-to-hop, and vertical page scroll on a phone-size viewport.
- [ ] **Step 9: Commit:** `Feat: 3D voxel figure on every page`.

---

### Task 8: End-to-end check and polish

**Files:** fixes only, as found.

- [ ] **Step 1: Full checks.** `npm test && npm run typecheck && npm run lint && npm run build` → all pass. Paste the summary lines into the report.
- [ ] **Step 2: Browser pass.** Check `/`, `/channels`, `/apps`, `/nope`, `/works/x` (redirects to `/`), and `/posts` (redirects to `/`), at 360px and 1280px, in light and dark mode. Check:
  - no sideways scroll; long titles clamp;
  - the figure is visible on the dark background thanks to the spotlight;
  - placeholder size matches the loaded figure, so nothing jumps;
  - with reduced motion turned on in the browser's dev tools, there is no sway or hop;
  - with WebGL disabled (`--disable-webgl` or dev tools), the placeholder stays and nothing else breaks;
  - the theme toggle works and is remembered;
  - keyboard focus is visible on the nav, the toggle and all links.
- [ ] **Step 3: Leak check.** `grep -r "YOUTUBE_API_KEY" .next/static` returns nothing. `git status` shows `Profile.pdf` untracked.
- [ ] **Step 4: Commit any fixes:** `Fix: polish after end-to-end check`.
- [ ] **Step 5: Report** to the owner:
  - what was checked;
  - the leftover unused files (`public/images/works.jpg`, `public/images/dev_icon.png`, `public/ImageToStl.com_smile.glb`), offered for deletion;
  - that `YOUTUBE_API_KEY` must be set in Vercel before the dashboards show numbers;
  - that `Profile.pdf` can now be deleted.
