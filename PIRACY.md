# Protecting agents from redistribution

A buyer could, in principle, purchase an agent, download the config, and re-host
or resell it. Here's how Project Mural closes that gap — in priority order, from
strongest to lightest.

## 1. Hosted execution is the product (strongest)

The default way to use an agent is **hosted on Project Mural** — you hire it and
it runs on our orchestration (memory, tools, MCP servers, security profile). The
buyer never receives the artifact, so there is nothing to copy. "Experts build,
we run, anyone hires" is not just the pitch; it's the anti-piracy model. Export
is a convenience for power users, not the default path.

## 2. The static config is the cheap part; the moat is the living skill

What a leaked file contains is a snapshot. What it *doesn't* contain is the
thing customers actually pay for over time:

- **Continuously vetted knowledge** — the specialist keeps the skill's memory
  current (e.g. Emily's fish-disease references). A stale leaked copy degrades.
- **Self-learning memory** that improves per-tenant on our infra.
- **Reputation and reviews** tied to the verified creator, which a pirate can't
  transfer.
- **Updates and support** that only flow to licensed, hosted runs.

Sell a subscription to the *living* skill, not a frozen text file.

## 3. Per-download watermarking (implemented)

Every export is uniquely stamped server-side at download time
(`app/api/export/[id]/route.ts` → `lib/exporters.ts`):

- A license id, e.g. `PM-EMILY-7F3A9C`
- The licensee reference and issue date
- Embedded non-redistribution terms

So any leaked or resold file is **traceable back to the buyer**, and the copy
visibly declares it is single-seat licensed. This deters casual sharing and
gives a clear basis for revocation. Downloads are `Cache-Control: no-store` so
each one is unique.

## 4. Buyer identity + license server (next step for production)

Today ownership is demo-grade (localStorage). For production:

- Real accounts and auth, so `licensedTo` is the actual buyer.
- A license-key activation check the exported agent phones home to on run, so a
  config without a valid, non-revoked key won't execute on a supported harness.
- Rotate/revoke a key if a leak is traced to it via the watermark.

## 5. Legal terms

The embedded terms (single-seat, no redistribution/resale) make redistribution a
license violation, which — combined with the watermark identifying the source —
is enforceable.

---

**Recommendation for the demo:** lead with #1 and #2 in the pitch (hosted +
living skill is why piracy barely matters), and show #3 live by downloading an
export and pointing at the embedded `PM-…` license stamp. #4 is the production
roadmap slide.
