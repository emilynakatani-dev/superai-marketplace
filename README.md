# Project Mural — Every expert, cloned as an agent

Marketplace demo built for SuperAI 2026: domain experts package their real
workflows into specialist AI agents; customers hire them on demand and export
the agent config to the harness they already run.

Agents are sourced from
[superai-lionclaw](https://github.com/cchacons/superai-lionclaw).

## Features

- **Agent overview** — landing page with all expert agents, ratings, pricing.
- **Agent detail** — the specialist behind the agent, creator profile + rating,
  the captured expert workflow ("workflows, not prompts"), tools, model.
- **Stripe checkout (test mode)** — one-time payment (Emily, Carlos) and
  monthly subscription (Eugene, Marcus, Scarlett). With no keys configured the
  site falls back to a built-in mock checkout, so the full flow always works.
- **Export to harness** — after purchase, download the agent as
  `*.agent.json5` (Lionclaw), `*.openclaw.json` (OpenClaw) or
  `*.hermes.yaml` (Hermes).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Stripe Node SDK

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without env vars the checkout runs in demo mode.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | no | Stripe **test-mode** secret key (`sk_test_…`). When set, checkout uses real Stripe Checkout sessions. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URL for Stripe redirects. Defaults to the request origin (fine on Vercel). |

Copy `.env.example` to `.env.local` for local development.

In Stripe test mode use card `4242 4242 4242 4242`, any future expiry, any CVC.

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo — the Next.js
   preset needs no configuration.
3. (Optional) Add `STRIPE_SECRET_KEY` under *Project → Settings → Environment
   Variables* to enable real test-mode checkout. Without it the demo checkout
   is used.
4. Every push to `main` redeploys automatically.

## Project structure

```
app/
  page.tsx                  # landing: hero + agent grid
  agents/[id]/page.tsx      # agent detail: specialist, creator, purchase, export
  checkout/demo/page.tsx    # mock checkout (used when no Stripe keys)
  api/checkout/route.ts     # creates Stripe Checkout sessions (or demo redirect)
  api/export/[id]/route.ts  # downloads agent config (lionclaw/openclaw/hermes)
components/                 # Navbar, Footer, AgentCard, PurchasePanel, …
lib/agents.ts               # agent + creator seed data
lib/exporters.ts            # harness export formats
public/avatars/             # agent avatars from the lionclaw repo
```
