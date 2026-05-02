# GIX Equipment Checkout (Lab 5)

A Next.js + Supabase app that replaces the dual-system equipment checkout flow Maason uses today.

## Pages

- `/items` - public browse of available equipment (mobile-first, table on desktop, cards on phone)
- `/checkout` - staff logs a checkout in one step
- `/return` - single-scan return flow
- `/admin` - register a new item with a clean human-readable name (replaces CSV upload)

## Setup

1. Create a Supabase project at https://supabase.com.
2. In the Supabase SQL editor, run `supabase/schema.sql`.
3. Copy `.env.local.example` to `.env.local` and paste your project URL and anon key.
4. Install dependencies and run dev server:

   ```bash
   npm install
   npm run dev
   ```

5. Open http://localhost:3000.

## Deployment (Vercel)

1. Push this folder to a GitHub repo.
2. Import the repo in Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in the Vercel dashboard.
4. Deploy. The live URL goes in the Component B report.

## Security

- Secrets live in `.env.local` (gitignored) locally and in Vercel env vars in production.
- Every Supabase call checks `error` and throws on failure; errors surface inline in the UI.
- Row Level Security is enabled on every table; only `items` is publicly readable.
