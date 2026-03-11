# AGENTS.md

## Cursor Cloud specific instructions

This is a **TanStack Start** (React SSR) app deployed to **Cloudflare Workers**. Single service, no database, no Docker.

### Running the app

- Dev server: `pnpm dev` (port 3000). Uses Vite + `@cloudflare/vite-plugin` which emulates Cloudflare Workers locally via Miniflare/workerd.
- Build: `pnpm build` (runs `vite build && tsc --noEmit`).
- See `README.md` for standard commands (dev, build, preview, deploy).

### Known issues

- **Pre-existing TS error**: `src/routes/index.tsx` references `env.MY_VAR` but the binding is not declared in `wrangler.jsonc`. `tsc --noEmit` fails with this error; Vite build still succeeds.
- **`/users` route 500 on SSR**: The users page uses a relative `fetch('/api/users')` which fails server-side in the workerd runtime (no base URL). Works fine client-side after initial load. This is a pre-existing example issue.

### Gotchas

- pnpm blocks build scripts by default. The `pnpm.onlyBuiltDependencies` field in `package.json` whitelists `esbuild`, `sharp`, and `workerd`. If new native deps are added, they must be added to this list.
- The `postinstall` script runs `wrangler types` to generate `worker-configuration.d.ts`. This runs automatically on `pnpm install`.
- No lockfile is committed; dependency resolution may vary across installs.
- No linter (ESLint) is configured. Type checking via `tsc --noEmit` is the closest lint-like check available.
