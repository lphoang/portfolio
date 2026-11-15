# Portfolio refresh: design

Date: 2026-11-15
Status: approved 2026-11-15

## Why

The site is from early 2023 and is out of date. The owner (Le Phuoc Hoang, software engineer in Da Nang) wants it to show who he is today:

- his **work history** (taken from his LinkedIn profile),
- his two **YouTube channels** and how they are doing,
- the **app** he is building (2Eat),
- a more personal look: a **3D voxel figure of himself** and a light **pixel / Game Boy** style. He is a big Pokémon fan.

## Goals

1. Up-to-date dependencies and a build that works (`npm run build`, `npm run lint`, type check all pass).
2. Three pages: **Home**, **Channels**, **Apps**.
3. Home shows the work history, education, hobbies and contact links.
4. Channels shows one live stats dashboard per YouTube channel.
5. Apps shows 2Eat with a "Coming soon" label.
6. New design: "44-bit" pixel style in the "Game Boy Mint" theme, with light and dark modes.
7. A 3D voxel figure of the owner on every page, in a different outfit per page.

## Non-goals

- No blog, no posts, no "Works" pages. They are removed.
- No CMS. All text lives in the repo as small data files.
- No growth-over-time charts for the channels (would need owner sign-in to YouTube or a database).
- No automatic sync with LinkedIn (LinkedIn has no practical API for this).
- No real 2Eat content yet (no store links, no screenshots).

## Anti-goals (would be a failure even if it works)

- Real Nintendo / Pokémon characters, logos or names in the visuals (Pikachu, Poké Ball, the Game Boy logo). The Game Boy feel comes only from colors and style.
- The YouTube API key reaching the browser.
- Long text in pixel fonts that is hard to read.
- Pages that feel slow on a phone because of the 3D figure.
- Committing `Profile.pdf` (the LinkedIn export in the repo root). It holds a private phone number and email.

## Approaches considered

| | Approach | Trade-off | Verdict |
|---|---|---|---|
| A | Latest Next.js (app router) + Tailwind CSS + React Three Fiber | Rewrites almost every component, but the design is new anyway. Server components keep the API key safe. | **Chosen** |
| B | Latest Next.js, pages router + Chakra UI v3 | Closest to today's code, but Chakra v3 is a rewrite too, and its look fights the custom pixel style. | Rejected |
| C | Astro static site with small React parts | Fastest pages, but a switch away from the owner's main stack (React / Next.js). | Rejected |

## What was decided

### Pages and navigation

- Menu: **Channels · Apps**. The logo ("leph") links to Home. A light/dark toggle sits on the right.
- Routes: `/`, `/channels`, `/apps`, and a simple custom not-found page (no figure).
- Remove: `/works`, `/works/[id]`, `/posts`, `/posts/[id]`, the microCMS hooks, their types and constants.
- Old links keep working: `/works`, `/works/*`, `/posts`, `/posts/*` redirect permanently to `/`.

### Home (`/`)

Top to bottom:

1. **Hero**: the 3D figure (Dev mode), name **"Le Phuoc Hoang"** (no Vietnamese accents), tagline "Developer, dreamer, everything all at once.", and a short intro.
   - Intro draft (owner may edit): "Software engineer in Da Nang, Vietnam. I build back-end and front-end web apps, mostly with Java and JavaScript. I also make YouTube videos and I'm building my first app, 2Eat."
2. **Work**: a timeline, newest first, from the LinkedIn export:
   - 2025 – now · Software Engineer · mgm technology partners Vietnam · Da Nang
   - 2023 – 2025 · Software Engineer · mesoneer · Da Nang
   - 2021 – 2023 · FPT Software · Da Nang. One entry with its roles: Back End Developer intern (Jun–Jul 2021), Back End Developer (Oct 2021 – Jan 2023), Frontend Developer (May 2022 – Jan 2023)
3. **Education**: 2017 – 2022 · Engineering degree · Danang University of Science and Technology. LinkedIn says "High School Diploma", which looks like a typo. The old site says "engineering degree", so we use that.
4. **Bio line**: "1999 · Born in Hue, Vietnam" stays, as the first or last line of the timeline.
5. **On YouTube / Building** (teasers, as in the approved theme mockup): one small row per channel with its name and subscriber count, linking to `/channels`; and the 2Eat card with its "Coming soon" badge, linking to `/apps`. They use the same cached YouTube data as the Channels page and the same fallback (no number, just the link) when stats are unavailable.
6. **I ♥**: reading detective books, adventure movies, coding, and Pokémon (games and anime).
7. **Connect**: GitHub (`@lphoang`), LinkedIn, and the two YouTube channels.

### Channels (`/channels`)

- The 3D figure in Creator mode, then one dashboard per channel (both post short vertical videos):

  | Channel | URL (confirmed by the owner) | One line (from the `coding-mate` repo) |
  |---|---|---|
  | **mike.thedreamER** | https://www.youtube.com/@mike.thedreamER18 | An English comic series of "what if" questions: every video is a new comic issue. |
  | **The coding mate** | https://www.youtube.com/@codingmate | Algorithms, data structures, system design and everyday trade-offs, one question at a time. |

- Each dashboard shows:
  - channel name, avatar, its one line, and a link to the channel,
  - three big numbers: **subscribers**, **total views**, **videos**,
  - a **bar chart of views** for the latest ~10 uploads,
  - a list of those uploads, one row each (changed later at the owner's request): a small cover on the left (Shorts as a 9:16 crop of the 480×360 thumbnail; landscape videos whole on their 16:9 thumbnail over a blurred copy; the shape comes from `videos.list` `part=player` with `maxHeight`), then the title (links to YouTube) and date · views · likes · comments, with singular words for 1.
- Data comes from the **YouTube Data API v3** with one API key. For each channel:
  `channels.list` (find the channel by handle, get its statistics and uploads playlist), then `playlistItems.list` (latest 10 uploads), then `videos.list` (their statistics). About 3 quota units per channel per refresh, far below the free 10,000 per day.
- Data is fetched **on the server** and cached for **6 hours** (Next.js revalidate). The key is a server-only environment variable, `YOUTUBE_API_KEY`.
- Channels are stored by **channel ID** (`UC…`) plus their public URL, so the site never depends on a handle lookup. The IDs aren't in any local repo: during the build, look each one up once with `channels.list?forHandle=` using the handles above, check the returned title matches, and save the ID in the data file.
- "Latest uploads" means the channel's uploads playlist as YouTube returns it, Shorts included.
- If the key is missing or a call fails, the dashboard still renders: the channel name, a link, and a short "Stats are taking a break" message. This is also what local development without a key shows. Once the site is live, a failed refresh keeps showing the last good data (Next.js keeps the cached page).
- If a channel hides its subscriber count, show "hidden" instead of a number.
- Numbers use short form (12.4K, 1.2M) with the full number on hover.

### Apps (`/apps`)

- The 3D figure in Player mode, then one card: **2Eat** (spelled as in its own build plan), its one line, and a **"Coming soon"** badge. No link for now.
- One line (from `../2eat/docs/design-prompt.md`): "A free meal planner for iPhone and Android that plans your meals to hit your daily protein and calorie targets within your grocery budget, and writes the shopping list."

### Visual design: "44-bit" + Game Boy Mint

"44-bit" means a clean modern site where pixels are only a hint. Approved mockup: `2026-11-15-portfolio-refresh/theme-reference.html`.

- **Fonts** (Google Fonts through `next/font`):
  - Space Grotesk: headings, logo, card titles
  - Inter: body text, including all long text
  - Silkscreen: small labels, menu items, badges, section labels like `// work`
  - Doto: big numbers (stats)
- **Pixel touches**: a faint 8px dot grid behind the page, the Silkscreen labels with `//` prefixes, the Doto numbers, 1px borders with 6px corners.
- **Colors** (tokens; dark values are a starting point to tune during the build):

  | Token | Light | Dark |
  |---|---|---|
  | background | `#e9f1df` | `#0f1f14` |
  | panel | `#f6faef` | `#16291c` |
  | line | `#b9cba6` | `#2c4a33` |
  | ink (text) | `#1b2e22` | `#e2f0d4` |
  | muted text | `#5b6f58` | `#9fb79a` |
  | accent | `#2f6b2b` | `#9bd96b` |
  | numbers | `#2f6b2b` | `#d4ec8a` |
  | badge bg / text | `#2f6b2b` / `#e9f1df` | `#9bd96b` / `#0f1f14` |
  | dot grid | `#1b2e2218` | `#e2f0d410` |

- **Light/dark**: follows the system setting on first visit, and the toggle choice is remembered. No flash of the wrong theme on load.
- Text and background colors must meet WCAG AA contrast in both modes.
- Works well from 360px phones up to desktop.

### The 3D figure: "voxel you"

Approved mockup: `2026-11-15-portfolio-refresh/figure-reference.html`. Its `colorAt` function is the approved shape model, ported as is.

- A chibi figure of the owner built from small cubes: fuller dark hair with volume on top, short tapered sides with the ears showing, a side-swept fringe, big olive square glasses that wrap the face, open eyes, strong brows, plain tee, watch on the left wrist.
- **Detail: 4×** (cube size 0.25 in model units). It renders at the screen's own resolution with no extra pixelation.
- **Three outfits, one per page:**

  | Page | Outfit |
  |---|---|
  | Home | **Dev mode**: black tee, headset with mic, arms down |
  | Channels | **Creator mode**: navy tee, filming with a phone (pink case, red record light) |
  | Apps | **Player mode**: white tee, holding an unbranded handheld with a green screen |

- **Dark mode**: the hair, headset and dark clothes almost vanish on the dark background. The figure's own colors stay as approved. Instead, in dark mode the figure sits on a soft, lighter round "spotlight" (a radial glow in the panel color) and gets a little more light, so it stays clearly visible.
- **Behavior**: gentle side-to-side sway when idle. Drag to spin it; on phones only horizontal drags, so the page still scrolls. Click or tap makes it hop. With "reduce motion" turned on there is no sway or hop, but dragging still works.
- **Performance**: the cubes are **worked out once, ahead of time**, by a small script that runs the shape model and saves a compact data file per outfit (only the visible surface cubes). The browser just draws them, with one instanced mesh per color. The figure loads after the rest of the page, with a same-size placeholder so nothing jumps.
- Has a text label for screen readers, e.g. "3D figure of Hoang wearing a headset".
- Built with React Three Fiber and Three.js: orthographic camera, ambient + directional light, Lambert materials.

### Tech and build

- Latest stable **Next.js** (app router), **React**, **TypeScript**, **Tailwind CSS**, **ESLint** (flat config with Next's rules), **Prettier** (keep today's style: no semicolons, single quotes, sorted imports).
- Remove: Chakra UI, Emotion, framer-motion, `@next/font`, microCMS code, `nodemon.json`, `tsconfig.server.json`.
- Fix the scripts: `dev` = `next dev`, `build` = `next build`, `start` = `next start` (the old one used the Windows-only `SET`), `lint` = `eslint .`.
- Env: `.env.example` lists `YOUTUBE_API_KEY=`. Drop the old `PORT` and the `NEXT_PUBLIC_MICRO_CMS_*` variables.
- `.gitignore` gets `Profile.pdf`, so the LinkedIn export can't be committed by accident.
- Content lives in typed data files (work history, education, hobbies, links, channel handles, apps).
- Page metadata through the Next.js metadata API (title, description).
- Hosting: **Vercel**. `YOUTUBE_API_KEY` is set in the Vercel project settings.

### Testing

- Unit tests (Vitest) for the YouTube mapping: short number format, hidden subscriber count, a failed or missing-key response turning into the fallback.
- The figure data script is deterministic: same input gives the same output.
- Before calling it done: lint, type check, unit tests and production build pass; the three pages are checked in a browser in light and dark mode at phone and desktop widths.

## Calls made by the designer (owner can change)

- Outfit per page: Dev → Home, Creator → Channels, Player → Apps.
- FPT Software shown as one entry with three roles.
- Education wording: "Engineering degree" (not LinkedIn's "High School Diploma").
- Intro text draft (above), and Pokémon added to "I ♥".
- Theme follows the system setting on first visit.
- Figure data generated ahead of time and committed, with a script to regenerate it.
- The avatar photo is no longer shown (the figure replaces it).
- Home also gets small teasers for the channels (subscriber count each) and 2Eat, matching the approved theme mockup.
- Dark mode: a soft spotlight behind the figure instead of changing its colors.
- Old `/works` and `/posts` links redirect to Home; the not-found page has no figure.
- Channels are stored by channel ID, and Shorts count as uploads.
- Channel and 2Eat one-liners taken from the owner's own repos (`coding-mate`, `2eat`).
- The third channel in `coding-mate` (Tàu hủ thập cẩm) is left out; only the two named channels are shown.

## Checked by the design reviewer

- Figure data size: about 16–18k surface cubes per outfit, about 37–41 KB gzipped. Well under the target.
- Color contrast: all text tokens pass WCAG AA in both modes (lowest is muted text on the background, 4.69:1).

## Left to the builder

- Exact package versions (latest stable at install time).
- Component and folder structure, as long as it stays simple.
- The bar chart: plain SVG or CSS bars are fine; no chart library needed.
- Exact file format for the figure data (e.g. JSON with a color list plus packed positions), as long as each outfit stays small (aim for under ~150 KB gzipped).
- Small spacing and size choices within the design above.
