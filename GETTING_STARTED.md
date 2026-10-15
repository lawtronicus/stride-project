# Stride — editable local project

This is the complete source for your private marathon tracker, exported from the live version on October 15, 2026.

Live website: https://samcheok-training.lawtrons.chatgpt.site
Source version: 29e1f834fcd791b9b7b124876ed162f8bb073a85

## Open the project

1. Unzip the download.
2. Move the `stride-project` folder wherever you keep projects on your Mac.
3. Open that folder in VS Code, Cursor, or your preferred editor.
4. Use the editor's integrated terminal for the commands below.

The live site remains available. Editing this folder does not automatically change the published website.

## Preview locally

Install Node.js 22.13 or newer (Node 24 is also supported), then run these commands from the project folder:

```sh
npx pnpm@11.25.0 install --frozen-lockfile
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_bright_moonstone.sql
npm run dev
```

Open http://localhost:5173. If you see a sign-in prompt, click **Sign in with ChatGPT**. In local development this uses the included mock identity, not your real ChatGPT account. Production authentication is unchanged.

Run the database migration once for a fresh local database. Do not run it again on subsequent starts. After setup, use only `npm run dev` to resume work. Stop the dev server with Control-C.

Use the normal package-manager command above rather than `npm run install:ci`; the latter is for the managed Linux authoring environment.

## Bring your existing training records over

1. Open the live website → Settings → Download JSON backup.
2. Open your local preview → Settings → Restore JSON backup.
3. Select the downloaded backup and confirm the replacement.

The local database lives under `.wrangler/state`. It is independent of the live database. Local edits and logs do not sync automatically. JSON backups can be used to transfer records in either direction; restore replaces the destination's records, so export a backup first.

The source archive intentionally contains no personal workout logs, credentials, dependency downloads, or local database files.

## Where to edit

- `app/page.tsx`: dashboard, weekly planner, logging forms, history, settings.
- `app/components/TrainingJourney.tsx`: progress timeline and runner placement.
- `app/globals.css`: styling and mobile layout.
- `public/runner.png`: your blond runner illustration.
- `lib/model.mjs`: seeded 25-week plan, calculations, validation.
- `app/api/state/route.ts`: authenticated database loading and saving.
- `db/schema.ts` and `drizzle/`: database schema and migrations.

## Check changes

```sh
node --test lib/model.test.mjs lib/api.test.mjs
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

The exported source was built successfully for the live website, and its automated data/API checks passed during implementation. A fresh Mac installation and browser interactions have not been tested here.

## Update the live website

The `.openai/hosting.json` file retains the identity of your existing Site. It contains configuration, not authentication secrets. This download contains no Git write token and makes no deployment automatically.

You can edit locally and bring the changed files back to this conversation for publication to the same Site. If you want a GitHub repository and ongoing synchronization, that can be set up separately. The download is a snapshot, not a connected Git clone.

For a private local Git history, run `git init` and commit your work. The included `.gitignore` excludes dependencies, environment files, generated build output, and local databases.
