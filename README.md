# Stride · Samcheok 2027

Private marathon training dashboard built from the supplied October 2026 PRD.

Read the [Stride Bible](STRIDE_BIBLE.md) before planning changes. It documents the current product, broader vision, major technical decisions, and open questions.

## Runtime
Vinext/React on Sites Workers; Cloudflare D1 stores versioned training state per authenticated ChatGPT user. The API requires platform identity and uses conditional writes to reject stale updates. D1 schema migrations are in `drizzle/`; the personalized plan is seeded once per user in the request path, never during migrations. No third-party credentials are needed.

## Features
Recovery week and all 25 prescribed weeks; run/strength logs; optional effort, fueling and terrain tracking; computed progress; interactive mileage charts; filterable history; original/revised/actual separation; rescheduling; settings; checkpoint reviews; full JSON backup/validated replacement restore and CSV export. PWA manifest supports standalone launch; offline editing is not supported.

## Verification
`node --test lib/*.test.mjs` exercises all seeded distances, calculated progress, log validation, plan edits, rescheduling, backup round trips, authenticated API reloads, per-user isolation and concurrent update rejection. The API test uses the same migration against an in-memory SQLite database and a D1-shaped adapter. `node node_modules/typescript/bin/tsc --noEmit` checks types. The Sites build verifies production compilation. Browser visual/interaction QA was unavailable in the managed environment.

Race changes deliberately preserve all workouts; review the existing taper and race workout after changing race date. Weekly target is a separate reference value; current planned totals always sum the workouts. Workout actual mileage is grouped by actual date, and planned mileage by scheduled date. No imported Apple Health history is included. Paces are editable guidance, not an automated coaching system.
