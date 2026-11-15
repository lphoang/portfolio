# Portfolio

Personal site of Le Phuoc Hoang: work history, YouTube channel stats and apps, with a 3D voxel figure on every page.

Built with Next.js (app router), Tailwind CSS and React Three Fiber.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Vitest) |
| `npm run figures` | Regenerate the 3D figure data in `public/figures/` |
| `npm run format` | Prettier |

## YouTube stats

The Channels page needs a YouTube Data API v3 key in `YOUTUBE_API_KEY`:

- locally: put it in `.env.local` (see `.env.example`),
- in production: set it in the Vercel project settings.

Without a key the site still works; the dashboards show a short "Stats are taking a break" message.

## Content

All text lives in `src/data/`: profile, work history, channels and apps. Edit those files to change what the site says.
