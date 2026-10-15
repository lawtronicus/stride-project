# Stride Bible

Last updated: 2026-10-15

This is the source of truth for Stride's product direction and major technical decisions. Read it before planning or implementing changes. Keep detailed setup instructions in [GETTING_STARTED.md](GETTING_STARTED.md) and link to implementation details rather than duplicating them here.

## Read before making changes

1. Does the change serve the intended runner and product direction?
2. Does it preserve the documented behavior, training history, and data guarantees?
3. Does it fit the current architecture and decisions?
4. Does it change a commitment that needs an explicit product or technical decision?
5. Which parts of this document need to change with the implementation?

Status vocabulary used throughout:

- **Confirmed direction:** Explicitly agreed with the product owner.
- **Current behavior:** Established by the repository; records what exists without assuming its original rationale or making it permanent.
- **Proposed:** A recommendation awaiting a decision; not a delivery commitment.
- **Open:** A question with no agreed answer.
- **Superseded:** A former decision retained with a link to its replacement.

The product owner decides product direction and changes to product commitments. Existing behavior is evidence, not automatic approval of a future design. If implementation and this document disagree, identify the discrepancy before changing the affected behavior. An explicit new user decision can supersede a recorded decision; update the record alongside the change. Do not turn an open question into a requirement without a decision.

# Product

## Where we are

**Confirmed direction.** Stride is a personal running app built to track its owner's progress toward a specific marathon goal. Its current features and training structure reflect that runner's needs, schedule, and race preparation.

This personal experience is the starting point for learning what helps a runner follow a plan, record training, understand progress, and adapt along the way.

**Current behavior.** The app centers on the Samcheok Marathon, provisionally dated April 10, 2027, with a recovery week and a 25-week training block. The seeded primary goal is 4:05–4:15, with a sub-four-hour stretch goal. These are personal plan defaults, not requirements for every future runner. The interface, calendar, pace guidance, and initial records contain personal assumptions.

Although storage is isolated by authenticated user, each new user currently receives the same personalized seed. That does not yet constitute a general onboarding or plan-building experience.

## Where we're going

**Confirmed direction.** Stride will become an app that runners of any experience level can use to **build, follow, and track a running plan that helps them achieve their goals**.

The product will evolve to support different starting points, goals, schedules, and training needs. Decisions should make that broader vision possible while preserving the usefulness of the current personal experience.

The current marathon plan is one plan Stride supports; future product decisions should allow other runners and goals to fit naturally. The vision does not yet select a plan-generation method, initial audience segment, release sequence, or business model.

## Principles and behavior to preserve

| Principle | Status | Implication for changes |
| --- | --- | --- |
| Support runners beyond the original athlete | Confirmed direction | Treat personal race, dates, identity, and paces as current assumptions to generalize deliberately. |
| Preserve training history when plans evolve | Current behavior | Editing a plan or race setting must not silently erase logged work. |
| Distinguish original, revised, and actual training | Current behavior | A changed prescription must remain distinguishable from what was originally planned and actually done. |
| Make progress calculations explainable | Current behavior | Use recorded values; retain unknown values as unknown and distinguish targets from workout totals. |
| Keep records private and portable | Current behavior | Maintain user isolation and full backup/restore capability when changing storage or identity. |
| Keep pace guidance under the runner's control | Current behavior | Editable guidance currently does not automatically prescribe or adapt training. Automated coaching requires a separate decision. |

## Core user stories

These describe existing capabilities unless marked otherwise.

| As a runner, I want to… | So that… | Status |
| --- | --- | --- |
| See my goal, current training phase, and upcoming sessions | I know what I am working toward and what to do next | Current behavior |
| Follow a weekly run and strength plan | I can organize training around a schedule | Current behavior |
| Record completed, partial, skipped, or rescheduled sessions | My history reflects what happened | Current behavior |
| Capture optional effort, heart rate, symptoms, terrain, fueling, and recovery notes | I have context for reviewing my training | Current behavior |
| Edit and reschedule workouts while retaining logs and plan revisions | I can adapt without losing context | Current behavior |
| Compare planned and actual training and filter my history | I can understand progress and consistency | Current behavior |
| Record checkpoint reviews and decisions | I can carry lessons into the next training phase | Current behavior |
| Export my records and restore a validated backup | I can retain and move my training data | Current behavior |
| Build a plan suited to my experience, goals, and availability | I can begin with training that fits me | Confirmed direction; not implemented as a general workflow |

## Current feature boundaries

- Main views: Dashboard, Weekly plan, History, and Settings; checkpoint reviews are available from the dashboard/settings.
- Workout plan edits record before/after revisions. Logs are separately editable; removing a log preserves its planned workout.
- Changing the race date preserves workout dates. The runner must review and move the taper and race workout explicitly.
- Weekly planned mileage sums current scheduled workouts. The editable weekly target is a separate reference value.
- Weekly actual mileage uses actual log dates. Weighted pace uses timed distance and recorded duration; unknown duration does not become zero-time running. Two seeded, athlete-reported recovery runs are explicit exceptions to the usual completed-run duration requirement.
- Completion consistency excludes future sessions. Past unlogged sessions are distinguishable from explicitly skipped sessions.
- JSON backup includes the complete training state. Restore validates and replaces records after confirmation; it does not merge. CSV exports logged workouts.
- The standalone web manifest supports app-like launch. Offline editing, Apple Health import, automatic plan generation, and automatic coaching are not implemented.
- Current presentation uses kilometers, pace per kilometer, and Asia/Seoul dates. These are present constraints, not settled requirements for a broader audience.

## Roadmap

**Confirmed destination:** Enable runners of any experience level to build, follow, and track plans for their goals. No dated releases or feature ordering have been agreed.

**Proposed discussion sequence:**

1. Define the first broader audience and goal types, plus how we will judge a successful experience.
2. Decide how a runner creates a plan: manually, from a template, through guidance, or another approach.
3. Define onboarding and how existing personal records survive the transition.
4. Agree the first release scope, then choose the technical changes it requires.

Apple Health import is mentioned as future work in the current interface. Its priority, scope, and delivery are uncommitted. Multiple concurrent plans, social features, device integrations, and automated coaching have no agreed commitment.

## Business direction and success

**Confirmed direction:** Expand from a personal marathon tracker to a product for runners across experience levels.

**Open:** Initial customer segment, positioning, distribution, pricing, monetization, and public launch scope. No business model or revenue target has been selected.

**Proposed success questions:** Can a runner create a suitable plan, understand the next session, record training reliably, and adapt while retaining history? Quantitative activation, retention, and outcome measures remain to be defined. Do not introduce analytics collection solely because measurement is discussed here.

## Open product decisions

- Which runners and goals should the first broader release serve?
- What inputs and level of guidance should plan creation require?
- Will Stride offer coaching or training recommendations, and what expertise and boundaries should govern them?
- How should plans respond to missed sessions, changing goals, or changing race dates?
- Will users have multiple goals, successive plans, or concurrent plans?
- Which units, timezones, languages, and accessibility expectations must the first broader release support?
- Should identity continue to depend on ChatGPT for the broader product?
- Which integrations matter first, and how should imported records reconcile with manual logs?
- What privacy, retention, account deletion, and export requirements should broader availability establish?

# Technical

## Architecture today

**Current behavior.** React/TypeScript UI runs through Vinext and Vite on Cloudflare Workers. The source uses Next-compatible APIs; the presence of Next dependencies does not mean production is a conventional Next server. Tailwind and shared UI components provide styling and controls.

| Responsibility | Implementation |
| --- | --- |
| Dashboard, planner, logging, history, settings | [app/page.tsx](app/page.tsx) |
| Training seed, validation, dates, metrics | [lib/model.mjs](lib/model.mjs) |
| Authenticated state reads and writes | [app/api/state/route.ts](app/api/state/route.ts) |
| Platform identity interpretation | [app/chatgpt-auth.ts](app/chatgpt-auth.ts) |
| D1 schema and migrations | [db/schema.ts](db/schema.ts), [drizzle/](drizzle/) |
| Worker entry and runtime configuration | [build/sites-worker.ts](build/sites-worker.ts), [vite.config.ts](vite.config.ts) |

Request flow: UI → authenticated `/api/state` → D1 `training_states` row for that user. GET creates the personalized seed if no row exists. PUT validates and conditionally replaces the full state. The UI adopts the new state/version after a successful save.

## Major technical decisions and constraints

The following records document current implementation as of 2026-10-15. Original selection rationale is not available in the repository; consequences below describe observed tradeoffs, not reconstructed decision history. Alternatives remain unselected unless explicitly stated.

| ID | Decision / status | Consequences and reason to revisit |
| --- | --- | --- |
| T-001 | **Current behavior:** Vinext/React on Cloudflare Workers, with local Wrangler/D1 development | Changes must work in the Worker runtime. Revisit if a confirmed requirement exceeds platform capabilities; no replacement stack has been selected. |
| T-002 | **Current behavior:** One versioned JSON training-state row per authenticated user in D1 | Plan, logs, settings, and checkpoints save together. This simplifies current state handling but couples writes and limits granular querying; broader plan/account models may require migration. |
| T-003 | **Current behavior:** Conditional writes using the client's integer version | A stale update returns HTTP 409 instead of overwriting another save. Keep conflict detection through storage changes. Automatic merge is not implemented. |
| T-004 | **Current behavior:** Platform-provided ChatGPT identity scopes server reads/writes | User identity comes from trusted hosting infrastructure, not a user ID supplied in the save payload. A future host/auth provider must establish an equivalent trust boundary. |
| T-005 | **Current behavior:** Seed per user on first GET; schema-only SQL migration | New-user defaults do not overwrite existing records. Changing the seed does not migrate existing users. Personal defaults must be addressed before general onboarding. |
| T-006 | **Current behavior:** Separate workout original, current plan, log, and revision list | Preserves plan-change context. This is not a complete immutable audit log of every edit or deletion. Preserve identifiers and meaningful history during migration. |
| T-007 | **Current behavior:** Schema-versioned JSON backup with validation and replacement restore | Current validator requires schemaVersion 1 and exactly 26 weeks. General plan lengths require deliberate schema/compatibility changes, not just a different seed. |
| T-008 | **Current behavior:** Portable development uses local mock sign-in and local persisted D1 | Local records are separate from production and do not automatically sync. Mock identity must remain confined to development. Managed execution uses different identity behavior. |

## Data integrity and security boundaries

- Authentication is required for state reads and writes; all queries scope data to the authenticated user ID.
- API state responses disable caching. PUT rejects a supplied cross-origin Origin header; an absent Origin header is currently accepted.
- Server validation checks state shape, workout IDs, dates, statuses, and numeric bounds. Keep validation at the server boundary even when the UI also validates.
- The API rejects save text over 4,000,000 characters; the import UI separately rejects files over 4,000,000 bytes. These are current checks, not a general storage sizing guarantee.
- Preserve original prescriptions, logged actuals, stable identifiers, and user isolation when evolving the schema. Plan edits must not silently rewrite recorded activity.
- Backups contain personal training information. Do not commit user exports, credentials, or local database files.
- A broader identity or hosting design must validate trusted headers and prevent caller spoofing. Reading identity headers alone does not establish their trust outside the current platform.

## Development, validation, and delivery

Use the existing checkout. Cloud tasks are isolated; do not create a Git worktree unless requested. See [GETTING_STARTED.md](GETTING_STARTED.md) for local setup and migration commands. Its archive-export background is historical; this workspace is now a Git checkout.

- Package manager: pinned pnpm 11.25.0 with frozen lockfile installation. Manifest runtime minimum is Node 22.13; Node 24 was used for cloud validation.
- Start local development with `npm run dev`. Local D1 persists under `.wrangler/state`; initialize the migration only for a fresh database.
- Relevant behavioral checks: `node --test lib/*.test.mjs`.
- Type check: `node node_modules/typescript/bin/tsc --noEmit --incremental false` to avoid rewriting tracked incremental build metadata.
- Production compilation: `npm run build`. Run lint when relevant to code changes; it does not replace behavioral validation.
- For UI changes, check the actual interaction, including keyboard/mobile behavior as relevant. A successful build does not establish visual or interaction correctness.
- API tests exercise route logic using in-memory SQLite and a D1-shaped adapter with substituted identity; they do not validate production identity injection or the full Worker runtime.
- Local startup checks should cover homepage loading, unauthenticated rejection, local sign-in, and authenticated state loading. Builds and local checks do not publish the site or verify production behavior.
- Deployment retains the existing Site identity in `.openai/hosting.json`; editing or building the checkout does not publish it. Deployment automation has not been defined here.

## Technical questions to resolve with product scope

- Plan/account schema for variable lengths, different goals, and multiple training cycles.
- Migration and backup compatibility for existing personal records.
- Identity portability, account lifecycle, and deletion semantics.
- Whether full-state saves remain suitable as usage and integrations grow.
- Automated browser and Worker integration coverage beyond current tests.

Do not preemptively replace the architecture to answer these questions. Select changes against agreed product requirements.

## Maintaining this document

Update this document in the same change that implements an agreed product or major technical decision. Routine implementation details belong in code or focused documentation. Roadmap proposals remain proposals until agreed.

For new major decisions, record: **ID, date, status, decision, rationale, alternatives considered, consequences, and affected sections**. If a decision replaces an earlier one, mark the old record Superseded and point to the new record. Keep the overview current so readers do not need to reconstruct it from history.

### Decision history

| ID | Date | Status | Decision and rationale | Alternatives / consequences |
| --- | --- | --- | --- | --- |
| P-001 | 2026-10-15 | Confirmed direction | Keep one repository-based Bible with Product and Technical sections so proposed changes can be checked against shared decisions. | Separate decision systems were not selected; link to detailed supporting documents as needed. |
| P-002 | 2026-10-15 | Confirmed direction | Product distinguishes “Where we are” from “Where we're going”: personal marathon tracking today; building, following, and tracking goal-based plans for runners of any experience level in the future. | No launch segment or implementation approach selected. Personal defaults are a starting point, not universal product rules. |

Initial evidence: product-owner discussion on 2026-10-15; repository README, getting-started guide, model, UI, API, schema, tests, and runtime configuration. The README references an October 2026 PRD that is not present in this checkout; this draft does not infer additional requirements from it.
