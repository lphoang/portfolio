# Kanotes Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/apps/kanotes` and `/apps/kanotes/privacy` the Kanotes app's own look as a bilingual
(VI/EN) product landing page, outside the portfolio's shell.

**Architecture:** Route groups under one shared root layout: the portfolio's pages move into
`src/app/(site)/` (whose layout draws today's shell), Kanotes lives in `src/app/(kanotes)/apps/kanotes/`
with its own layout. Both languages are in the HTML; a pre-paint script sets
`data-kanotes-lang` on `<html>` and CSS shows one language.

**Tech Stack:** Next.js 16 App Router (read `node_modules/next/dist/docs/` before writing Next code,
per AGENTS.md), React 19, Tailwind v4, next/font, next/image, vitest with `renderToStaticMarkup`
(node environment).

**Spec:** `docs/superpowers/specs/2026-11-17-kanotes-landing-design.md`

## Global Constraints

- Nothing portfolio-looking on Kanotes pages: no `Navbar`, era toggle, backgrounds, CRT overlay, mono or pixel fonts.
- Other portfolio pages must look and behave exactly as before (shell, page-enter animation, 404).
- Kanotes colors, light "mint": bg `#E8F6EF`, text `#1E2B25`, muted `#55665D`, primary `#12795F`, card `#FFFFFF`, card border `#D3EBDF`, panel `#F4FBF7`, yuzu `#FFB347`, on-yuzu `#1C140F`.
- Kanotes colors, dark "cocoa" (`prefers-color-scheme: dark`): bg `#16110E`, text `#F6EBDD`, muted `#BFAE9C`, primary `#FFB347`, card `#221A15`, card border `#2E241D`, panel `#2A211B`, yuzu `#FFB347`, on-yuzu `#1C140F`.
- Font: Nunito via `next/font/google`, subsets `latin` and `vietnamese`.
- Without JavaScript, English shows.
- Fixed copy: hero tagline "Một chạm, Kapy lưu giúp bạn nha" / "One click, Kapy saves it for you"; badge "Sắp ra mắt" / "Coming soon"; button "Tải trên Google Play" / "Get it on Google Play" (`aria-disabled="true"`, no link); back button "← Ứng dụng của tôi" / "← My apps" to `/apps`; privacy back link "← Kanotes" to `/apps/kanotes`. Other copy from `screennote/docs/store/listing.md` and today's privacy page.
- Gentle motion only, none under `prefers-reduced-motion: reduce`.
- Run commands from the portfolio root. Commit only when the user asks; leave each task's changes staged-ready.

## Review Focus

1. Client-side navigation from `/apps` into `/apps/kanotes` (the inline script doesn't run): a Vietnamese browser should still see Vietnamese, with no reload. Pinned by `languageOnMount` tests in Task 2.
2. `localStorage` that throws (private mode, blocked storage): the page still picks a language from the browser and the switch still works for the visit. Pinned by `readSavedLanguage` tests in Task 2.
3. A saved value that isn't `vi`/`en` (old or tampered): ignored; the browser's language decides. Pinned in Task 2.
4. Leaving Kanotes for a portfolio page: Kanotes CSS (loaded globally once visited) must not change the portfolio. Pinned by the selector-scope test in Task 3.
5. Short page or overscroll: the whole viewport is Kanotes-colored, not the portfolio's era background. Pinned by the `:has(.kanotes)` body rule test in Task 3; checked by eye in Task 6.

---

### Task 1: Move the portfolio into its own shell

**Files:**
- Create: `src/components/SiteShell.tsx`, `src/app/(site)/layout.tsx`, `src/components/SiteShell.test.tsx`
- Modify: `src/app/layout.tsx` (keep `<html>`, `<head>` era script, `<body className="min-h-dvh antialiased">`, fonts, metadata; body renders `children` only), `src/app/not-found.tsx` (wrap its content in `SiteShell`)
- Move (`git mv`, contents unchanged): `src/app/page.tsx` → `src/app/(site)/page.tsx`; `src/app/apps/page.tsx` → `src/app/(site)/apps/page.tsx`; `src/app/channels/page.tsx` → `src/app/(site)/channels/page.tsx`; `src/app/template.tsx` and `template.test.tsx` → `src/app/(site)/`

**Interfaces:**
- Produces: `SiteShell({ children }: { children: React.ReactNode }): JSX.Element`: exactly what `RootLayout`'s body draws today (`TerminalRain`, `StarrySky`, `Silhouettes`, `.text-haze`, `.crt.dev-only`, `Navbar`, the `<main>` column, `EraFavicon`).

- [ ] **Step 1: Write the failing tests** in `src/components/SiteShell.test.tsx`

```tsx
test('the site shell draws the navbar around the page', () => {
  const html = renderToStaticMarkup(<SiteShell><p>page</p></SiteShell>)
  expect(html).toContain('era-nav')
  expect(html).toMatch(/<main[^>]*>[\s\S]*<p>page<\/p>[\s\S]*<\/main>/)
})

test('the 404 page keeps the site shell', () => {
  const html = renderToStaticMarkup(<NotFound />)
  expect(html).toContain('era-nav')
  expect(html).toContain('Not found')
})
```

- [ ] **Step 2: Run them, expect FAIL** (`SiteShell` doesn't exist): `npx vitest run src/components/SiteShell.test.tsx`
- [ ] **Step 3: Create `SiteShell`, the `(site)` layout, strip the root layout, wrap the 404, move the routes and the template.**
- [ ] **Step 4: Run the full suite, expect PASS:** `npx vitest run` (the moved template test and the old Kanotes tests still pass).
- [ ] **Step 5: Build, expect the same routes:** `npm run build`. Expected: `/`, `/apps`, `/channels`, `/apps/kanotes`, `/apps/kanotes/privacy` all listed, no errors.

---

### Task 2: Language choice

**Files:**
- Create: `src/lib/kanotesLang.ts`, `src/lib/kanotesLang.test.ts`

**Interfaces:**
- Produces:
  - `type KanotesLang = 'vi' | 'en'`; `LANG_KEY = 'kanotes-lang'`; `LANG_ATTR = 'kanotesLang'` (the `dataset` key, i.e. `data-kanotes-lang`)
  - `pickLanguage(saved: string | null, languages: readonly string[]): KanotesLang`
  - `readSavedLanguage(storage: Pick<Storage, 'getItem'> | undefined): string | null` (never throws)
  - `languageOnMount(current: string | undefined, saved: string | null, languages: readonly string[]): KanotesLang | null`: `null` when `current` is already `vi`/`en`, else `pickLanguage(saved, languages)`
  - `applyLanguage(lang: KanotesLang, remember: boolean): void`: sets the attribute; saves only when `remember` (try/catch)
  - `languageScript: string`: pre-paint IIFE built from `pickLanguage.toString()` (same pattern as `eraScript` in `src/lib/era.ts`)

- [ ] **Step 1: Write the failing tests**

```ts
test('a saved choice wins', () => {
  expect(pickLanguage('en', ['vi-VN'])).toBe('en')
  expect(pickLanguage('vi', ['en-US'])).toBe('vi')
})
test('otherwise Vietnamese browsers get Vietnamese', () => {
  expect(pickLanguage(null, ['vi-VN', 'en'])).toBe('vi')
  expect(pickLanguage(null, ['en-US', 'vi'])).toBe('vi')
  expect(pickLanguage(null, ['vi'])).toBe('vi')
})
test('everyone else gets English', () => {
  expect(pickLanguage(null, ['en-US'])).toBe('en')
  expect(pickLanguage(null, ['cs-CZ'])).toBe('en')
  expect(pickLanguage(null, [])).toBe('en')
})
test('a saved value that is not vi or en is ignored', () => {
  expect(pickLanguage('fr', ['vi-VN'])).toBe('vi')
  expect(pickLanguage('', ['en-US'])).toBe('en')
})
test('blocked storage reads as nothing saved', () => {
  const throwing = { getItem: () => { throw new Error('blocked') } }
  expect(readSavedLanguage(throwing)).toBeNull()
  expect(readSavedLanguage(undefined)).toBeNull()
  expect(readSavedLanguage({ getItem: () => 'vi' })).toBe('vi')
})
test('on a client-side visit the language is set once', () => {
  expect(languageOnMount(undefined, null, ['vi-VN'])).toBe('vi')
  expect(languageOnMount('en', null, ['vi-VN'])).toBeNull()
})
test('the pre-paint script sets the attribute from the same rule', () => {
  expect(languageScript).toContain('kanotes-lang')
  expect(languageScript).toContain('kanotesLang')
})
```

- [ ] **Step 2: Run, expect FAIL** (module missing): `npx vitest run src/lib/kanotesLang.test.ts`
- [ ] **Step 3: Implement `src/lib/kanotesLang.ts`.** The script reads storage in try/catch, uses `navigator.languages || [navigator.language]`, sets `document.documentElement.dataset.kanotesLang`.
- [ ] **Step 4: Run, expect PASS:** `npx vitest run src/lib/kanotesLang.test.ts`

---

### Task 3: Kanotes layout, look and language switch

**Files:**
- Create: `src/app/(kanotes)/apps/kanotes/layout.tsx`, `src/app/(kanotes)/kanotes.css`, `src/components/kanotes/T.tsx`, `src/components/kanotes/LanguageSwitch.tsx`, `src/components/kanotes/KanotesShell.tsx`, `src/components/kanotes/KanotesShell.test.tsx`, `src/app/(kanotes)/kanotes-css.test.ts`

**Interfaces:**
- Consumes: Task 2's `KanotesLang`, `LANG_KEY`, `readSavedLanguage`, `languageOnMount`, `applyLanguage`, `languageScript`.
- Produces:
  - `T({ vi, en }: { vi: React.ReactNode; en: React.ReactNode })`: `<span lang="vi" class="k-vi">…</span><span lang="en" class="k-en">…</span>`
  - `KanotesShell({ children })`: `<div class="kanotes">` with the top bar (Kapy face `/apps/kanotes/kapy.svg` + "Kanotes" linking to `/apps/kanotes`, `LanguageSwitch` on the right) and `children`. No footer (each page owns its bottom link).
  - `LanguageSwitch()`: client component; two buttons "VI" / "EN" with `aria-pressed`; reads the attribute with `useSyncExternalStore` (server snapshot `'en'`, a `MutationObserver` on `data-kanotes-lang`, like `src/lib/useEra.ts`); on click `applyLanguage(lang, true)`; on mount applies `languageOnMount(...)` with `remember = false`.
  - CSS variables on `.kanotes`: `--k-bg --k-ink --k-muted --k-primary --k-card --k-border --k-panel --k-yuzu --k-on-yuzu`, values from Global Constraints, the dark set under `@media (prefers-color-scheme: dark)`.
  - The layout: Nunito as `--font-nunito`, `metadata` with `title: { absolute: 'Kanotes: notes from any screen' }`, the description from the listing's English short description, `icons: '/apps/kanotes/kapy.svg'`; renders `<script dangerouslySetInnerHTML={{ __html: languageScript }} />` then `KanotesShell`.

- [ ] **Step 1: Write the failing tests**

`KanotesShell.test.tsx`:
```tsx
test('the Kanotes shell has its own top bar and no portfolio navbar', () => {
  const html = renderToStaticMarkup(<KanotesShell><p>page</p></KanotesShell>)
  expect(html).toContain('class="kanotes')
  expect(html).toContain('/apps/kanotes/kapy.svg')
  expect(html).not.toContain('era-nav')
  expect(html).toMatch(/aria-pressed="(true|false)"[^>]*>VI/)
  expect(html).toMatch(/aria-pressed="(true|false)"[^>]*>EN/)
})
test('T puts each language in its own lang element', () => {
  const html = renderToStaticMarkup(<T vi="Xin chào" en="Hello" />)
  expect(html).toBe('<span lang="vi" class="k-vi">Xin chào</span><span lang="en" class="k-en">Hello</span>')
})
```

`kanotes-css.test.ts` (reads `src/app/(kanotes)/kanotes.css`):
```ts
test('Kanotes styles never reach portfolio pages', () => {
  // Every rule's selectors start with .kanotes, or target html by the language
  // attribute / :has(.kanotes); @media and @keyframes blocks are checked inside.
  for (const selector of selectorsIn(css))
    expect(selector).toMatch(/^(\.kanotes\b|html(\[data-kanotes-lang|:not\(\[data-kanotes-lang|:has\(\.kanotes\)))/)
})
test('without the Vietnamese attribute, Vietnamese text is hidden (English shows without JS)', () => {
  expect(css).toMatch(/html:not\(\[data-kanotes-lang='vi'\]\) \.k-vi[^{]*\{[^}]*display: none/)
  expect(css).toMatch(/html\[data-kanotes-lang='vi'\] \.k-en[^{]*\{[^}]*display: none/)
})
test('the whole viewport takes the Kanotes background', () => {
  expect(css).toMatch(/html:has\(\.kanotes\) body\s*\{[^}]*background/)
})
test('Kanotes text colors meet WCAG AA in both looks', () => {
  // contrastRatio from src/lib/contrast.ts; pairs from Global Constraints
  for (const [fg, bg] of [['#1E2B25','#E8F6EF'],['#55665D','#E8F6EF'],['#12795F','#E8F6EF'],['#1C140F','#FFB347'],
                          ['#F6EBDD','#16110E'],['#BFAE9C','#16110E'],['#FFB347','#16110E'],['#BFAE9C','#221A15']])
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5)
})
```
`selectorsIn(css)` is a small helper in the test: strip comments, take each rule's prelude before `{`, skip `@media`/`@keyframes` preludes and keyframe steps (`from`, `to`, percentages), split on commas, trim.

- [ ] **Step 2: Run, expect FAIL:** `npx vitest run src/components/kanotes src/app/\(kanotes\)/kanotes-css.test.ts`
- [ ] **Step 3: Implement the CSS, `T`, `LanguageSwitch`, `KanotesShell` and the layout.** Kanotes CSS is imported by the Kanotes layout only. Rounded cards, Nunito headings at 800–900 weight, the yuzu pill for the switch's active button.
- [ ] **Step 4: Run, expect PASS:** same command as Step 2, then `npx vitest run` (the full suite).

---

### Task 4: The landing page

**Files:**
- Move: `src/app/apps/kanotes/page.tsx` and `page.test.tsx` → `src/app/(kanotes)/apps/kanotes/` (`git mv`), then rewrite the page
- Create: `src/components/kanotes/StoreBadge.tsx`, `src/components/kanotes/PhoneFrame.tsx`, `public/apps/kanotes/vi/screen-1.png` … `screen-4.png` (copies of screennote `docs/store/graphics/screenshot-1.png` … `-4.png`)

**Interfaces:**
- Consumes: `T`, `KanotesShell` (through the layout), `--k-*` variables.
- Produces: `StoreBadge()`: the "Coming soon" badge directly above the greyed Play button, both in `T`; the button is a `<span aria-disabled="true">` with a generic play triangle. `PhoneFrame({ vi, en }: { vi: { src: string; alt: string }; en: { src: string; alt: string } })`: two `next/image` (1080×2160) in one CSS phone frame, the Vietnamese one with class `k-vi`, the English one `k-en`, neither preloaded.

- [ ] **Step 1: Rewrite `page.test.tsx`'s page tests** (keep the apps-data test as is):

```tsx
test('both languages tell the same hero', () => {
  expect(html).toContain('<span lang="vi" class="k-vi">Một chạm, Kapy lưu giúp bạn nha</span>')
  expect(html).toContain('<span lang="en" class="k-en">One click, Kapy saves it for you</span>')
})
test('"Coming soon" sits above the Google Play button, in both languages', () => {
  expect(html.indexOf('Sắp ra mắt')).toBeGreaterThan(-1)
  expect(html.indexOf('Tải trên Google Play')).toBeGreaterThan(html.indexOf('Sắp ra mắt'))
  expect(html.indexOf('Get it on Google Play')).toBeGreaterThan(html.indexOf('Coming soon'))
  expect(html).toMatch(/aria-disabled="true"[^>]*>[\s\S]*Google Play/)
  expect(html).not.toContain('play.google.com')
})
test('each language shows its own screenshots', () => {
  for (const n of [1, 2, 3, 4]) {
    expect(html).toContain(`%2Fapps%2Fkanotes%2Fscreen-${n}.png`)
    expect(html).toContain(`%2Fapps%2Fkanotes%2Fvi%2Fscreen-${n}.png`)
  }
})
test('the page links the privacy policy and ends with one back button to my apps', () => {
  expect(html).toContain('href="/apps/kanotes/privacy"')
  const links = [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map(m => m[1])
  expect(links.at(-1)).toBe('/apps')
  expect(html).toContain('← My apps')
  expect(html).toContain('← Ứng dụng của tôi')
})
```
(`html` = `renderToStaticMarkup(<KanotesPage />)`. If `next/image` renders `src` unencoded, match `/apps/kanotes/screen-${n}.png` instead; check once and pick one form.)

- [ ] **Step 2: Run, expect FAIL** on the new tests: `npx vitest run src/app/\(kanotes\)/apps/kanotes/page.test.tsx`
- [ ] **Step 3: Copy the Vietnamese screenshots and write the page**, sections in the spec's order: hero (tagline, a line on how: hold the side button or share, the tile, the widget; `StoreBadge`, `PhoneFrame` with screen 1); how it works (3 steps, screen 2); Vietnamese chats (phrase chips "Mai 8h cf nha", "thứ 6 tuần sau 7h tối", "mốt 9h30", "20/11 2h chiều", screen 3); Tell Kapy (screen 4); private by default + Kanotes Cloud (privacy link); closing `StoreBadge` with Kapy; the back button. Each image's alt text in its own language (English alts from today's page).
- [ ] **Step 4: Run, expect PASS:** same command, then `npx vitest run`.

---

### Task 5: The privacy page in the Kanotes look

**Files:**
- Move: `src/app/apps/kanotes/privacy/page.tsx` → `src/app/(kanotes)/apps/kanotes/privacy/page.tsx` (`git mv`), then restyle; remove the now-empty `src/app/apps/kanotes/`

**Interfaces:**
- Consumes: `T`, `--k-*` variables. Keeps today's `english` / `vietnamese` `Part[]` text unchanged.

- [ ] **Step 1: Add the failing test** to `page.test.tsx` (keep the existing privacy test):

```tsx
test('the privacy policy shows one language at a time and links back to Kanotes', () => {
  const html = renderToStaticMarkup(<KanotesPrivacyPage />)
  expect(html).toMatch(/<section lang="en" class="k-en/)
  expect(html).toMatch(/<section lang="vi" class="k-vi/)
  expect(html).toMatch(/<a [^>]*href="\/apps\/kanotes"[^>]*>← Kanotes<\/a>/)
  expect(html).not.toContain('section-label')
})
```

- [ ] **Step 2: Run, expect FAIL:** `npx vitest run src/app/\(kanotes\)/apps/kanotes/page.test.tsx`
- [ ] **Step 3: Restyle the page:** title block via `T`, each language's `Policy` as `<section lang=… class="k-…">` with Kanotes cards instead of `SectionLabel`/`.card`, the back link at the bottom, `metadata.title` `{ absolute: 'Kanotes privacy policy' }`.
- [ ] **Step 4: Run, expect PASS:** same command, then `npx vitest run`.

---

### Task 6: Check it all

- [ ] **Step 1:** `npm run lint && npm run typecheck && npx prettier --check . && npx vitest run`. Expected: no errors, all tests pass.
- [ ] **Step 2:** `npm run build`. Expected: the five routes, static, no errors.
- [ ] **Step 3: Look at it** in the browser (dev server on :3000), at 390 px and 1280 px wide: `/apps/kanotes` in VI and EN (switch), the privacy page, overscroll at the bottom (no portfolio background), then click "← My apps" and confirm `/apps` looks exactly as before in both Dev and Vibe; from `/apps` click the Kanotes card and confirm the language is set without a reload. Dark look: compare by emulating `prefers-color-scheme: dark` in DevTools or by temporarily checking the CSS values.
- [ ] **Step 4:** Report to the user; commit only when they ask.
