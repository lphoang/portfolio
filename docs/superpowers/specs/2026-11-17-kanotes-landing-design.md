# Kanotes landing page: design

Approved 2026-11-17. A short design (small change).

## Why
`/apps/kanotes` looks like any other portfolio page (navbar, dev/vibe backgrounds, narrow column,
mono fonts). It should feel like a real product landing page, the kind an app links to as its
website. Google Play's listing already names this page as Kanotes' website, so Vietnamese Play
visitors land here too, as well as portfolio visitors.

## Goals
- `/apps/kanotes` and `/apps/kanotes/privacy` look like the Kanotes app, not the portfolio.
- The page reads in Vietnamese or English. Vietnamese browsers get Vietnamese, everyone else
  English, picked before the page shows; a VI/EN switch remembers the visitor's choice.
- At the bottom, one small back button to the apps list (`/apps`). Nothing else in the footer.

## Non-goals
- A real Google Play link (the app isn't on sale yet; the button stays greyed and goes nowhere).
- A price for Kanotes Cloud (not settled yet).
- New Kapy illustrations: use the existing face (`public/apps/kanotes/kapy.svg`) and the
  screenshots, which already show Kapy.
- Any change to how the other portfolio pages look.

## Anti-goals
- Anything portfolio-looking on the Kanotes pages: the navbar, era toggle, terminal rain, stars,
  CRT overlay, mono/pixel fonts.
- A flash of the wrong language on first load.
- Breaking the portfolio's routes, its page-enter animation or its 404 page.

## Approaches
1. **Own layout through route groups (picked).** The portfolio's pages move into `src/app/(site)/`,
   whose layout keeps today's navbar, backgrounds and column. Kanotes moves into
   `src/app/(kanotes)/apps/kanotes/` with its own layout. The root layout keeps only what both
   share (`<html>`, `<body>`, fonts, the era script). Navigation stays client-side and the 404
   page keeps working.
2. Two root layouts. Full isolation, but every move between the portfolio and Kanotes reloads the
   whole page, and the app-wide 404 then needs the experimental `global-not-found`.
3. Cover the portfolio from inside the page (a full-screen fixed layer). Cheapest, but a hack:
   the navbar and animations still run underneath, and scrolling happens inside a layer.

## The design

### Structure
- `src/app/layout.tsx`: `<html>`, `<body>`, fonts, era script. Nothing visible.
- A `SiteShell` component holds what the root layout draws today (backgrounds, CRT overlay,
  `Navbar`, `<main>` column, `EraFavicon`). `src/app/(site)/layout.tsx` renders it, and so does
  `src/app/not-found.tsx` (the 404 renders under the root layout only).
- `src/app/(site)/`: `page.tsx`, `apps/page.tsx`, `channels/page.tsx` and `template.tsx` (with its
  test) move here unchanged.
- `src/app/(kanotes)/apps/kanotes/`: `layout.tsx` (Kanotes look, Nunito, language script,
  Kapy favicon, title "Kanotes: notes from any screen"), `page.tsx`, `privacy/page.tsx`, tests.

### Look (the app's own brand, from screennote `ui/theme/Color.kt`)
- Light "mint": background `#E8F6EF`, text `#1E2B25`, muted `#55665D`, primary green `#12795F`,
  cards `#FFFFFF` with border `#D3EBDF`, soft panel `#F4FBF7`, yuzu `#FFB347` with text `#1C140F`
  for the main call to action and accents.
- Light only (changed by the user after the first build; no dark look). Former dark "cocoa" values, unused: background `#16110E`, text `#F6EBDD`,
  muted `#BFAE9C`, cards `#221A15` with border `#2E241D`, panel `#2A211B`, yuzu `#FFB347` as
  primary.
- Nunito (next/font, latin + vietnamese), heavy weights for headings, generous rounded corners,
  phone screenshots in a CSS phone frame. Gentle motion only, off under `prefers-reduced-motion`.

### Page, top to bottom
1. Top bar: Kapy face + "Kanotes" on the left, the VI/EN switch on the right.
2. Hero tagline: "Một chạm, Kapy lưu giúp bạn nha" / "One click, Kapy saves it for you"
   (the user's wording), a line on how (hold the side button, or share, the tile, the widget; Kapy reads it),
   the "Coming soon" badge directly above the greyed "Get it on Google Play" button
   (`aria-disabled="true"`), and screenshot 1 (Kapy's card over a chat) in a phone frame.
3. How it works, three steps: hold the side button (or the tile, share, the widget) → Kapy reads
   it, on your phone → check the card and save (events to the "Kanotes" calendar, notes in
   Kanotes). Screenshot 2 (Kapy reading).
4. Made for Vietnamese chats: the phrases "Mai 8h cf nha", "thứ 6 tuần sau 7h tối", "mốt 9h30",
   "20/11 2h chiều" as chips; accents optional; the sooner time when morning/evening isn't said.
   Screenshot 3 (home with events and a note).
5. Tell Kapy in your own words: the + button. Screenshot 4.
6. Private by default: reads on your phone (Gemini Nano or Gemma), no account, no ads, no
   tracking, with the link to the privacy policy (`/apps/kanotes/privacy`). Kanotes Cloud as an
   optional subscription: Gemini in Google's cloud, up to 300 reads a month, screen text goes to
   Google only then.
7. Closing call to action: Kapy, "Coming soon" above the greyed Play button again.
8. Footer: one small "← My apps" / "← Ứng dụng của tôi" link to `/apps`. Nothing else.

Texts come from `screennote/docs/store/listing.md` (both languages) and the privacy policy.

### Language
- Every text exists in both languages in the HTML, each in an element with `lang="vi"` or
  `lang="en"`; CSS shows one. Without JavaScript, English shows.
- A tiny inline script in the Kanotes layout sets `data-kanotes-lang` on `<html>` before paint:
  the saved choice from `localStorage` (read inside try/catch) if any, otherwise `vi` when any of
  `navigator.languages` starts with `vi`, otherwise `en`. The choice logic is a pure function
  (`pickLanguage(saved, languages)`) that the script and the tests share.
- The VI/EN switch (a small client component, buttons with `aria-pressed`) sets the attribute
  and saves the choice (try/catch). On a client-side navigation into Kanotes the inline script
  doesn't run, so the switch also applies the choice when it mounts.
- Screenshots per language: English at `public/apps/kanotes/screen-1..4.png` (today's files),
  Vietnamese at `public/apps/kanotes/vi/screen-1..4.png` (copied from screennote
  `docs/store/graphics/screenshot-1..4.png`). Each image's alt text is in its own language.

### Privacy page
Same layout and look, one language at a time through the same switch, the same policy text as
today. At its bottom, a small "← Kanotes" link back to the landing page.

### Tests (vitest, `renderToStaticMarkup`)
Keep the existing four, adjusted to the new paths, and add:
- both languages' hero texts are present, each inside its `lang` element;
- the Vietnamese screenshots are present;
- the page's last link is the back button to `/apps`, and there is no portfolio navbar;
- `pickLanguage`: saved choice wins; `vi-VN` → `vi`; `en-US`/`cs-CZ` → `en`; nothing → `en`;
- the privacy page links back to `/apps/kanotes`;
- the 404 page still renders the site shell.

## Left to the builder
Exact copy lengths and line breaks, spacing, the phone frame's details, the motion, and whether
the hero shows a second tilted phone behind the first.
