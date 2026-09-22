# Seagull documentation

Independent technical documentation for Seagull V2: current implementation, target architecture, operational guides, and source-derived references. Built with Docusaurus 3.9.2, React 18, TypeScript, MDX, and selective Elastic UI components. A single themed `EuiProvider` costs about 73 KB gzipped in the shared bundle and is the measured price of EUI parity in both color modes; deep EUI imports were measured to save nothing and lose type declarations. Static, local search; no application backend or database.

## Develop with Docker

Requires Docker Engine with BuildKit and the Compose plugin (v2+), or Docker Desktop. No host Node installation is required. Linux is the validated development platform; native file notifications are used by default.

```bash
docker compose up --build
```

Open <http://localhost:3000>. Source changes reload automatically. Container dependencies use a named volume, separate from host `node_modules`. They are installed again only when the lockfile changes. Generated Docusaurus files stay inside each container, separate from host `.docusaurus`, so a host build or a one-off `docker compose run` does not disturb the running server. If file notifications fail on Docker Desktop/WSL mounts, start with `WATCH_POLL=true docker compose up` (one-second polling).

```bash
docker compose run --rm docs npm run check
docker compose run --rm docs npm install <package>
docker compose down
```

Dependency changes should be reviewed and followed by an image rebuild. `docker compose down` preserves the dependency volume. Optional `.env.example` documents public URL, base path, development port, and polling. Never put secrets into this static site's configuration.

## Production

```bash
docker build -t seagull-wiki:local \
  --build-arg DOCS_URL=https://docs.example.com .
docker run --rm --name seagull-wiki-production \
  --read-only --tmpfs /tmp:rw,noexec,nosuid,size=32m \
  --cap-drop ALL --security-opt no-new-privileges \
  -p 127.0.0.1:8080:8080 seagull-wiki:local
```

Replace the example origin before publishing. The final image serves static assets through Nginx as UID 101; it contains no Node runtime or source tree. TLS belongs to the external reverse proxy. Health is at `/healthz`; logs use stdout/stderr. Hashed assets have long cache lifetimes, HTML revalidates, and text is precompressed during the build.

For a subpath, add `--build-arg DOCS_BASE_URL=/wiki/` and forward that prefix unchanged through the proxy. Page paths then include `/wiki/docs/...`. The prefix must not be `/docs/`: Docusaurus leaves a site link that already starts with the base URL unprefixed, so every `/docs/...` link would break. The configuration rejects that value. Public URL/base-path changes require rebuilding. `VERSION` and `REVISION` build arguments populate OCI metadata. Static hosting can instead deploy the `build/` directory.

## Validation and maintenance

With Node 22 available, the equivalent native commands are:

```bash
npm ci
npm run check
npx playwright install chromium
DOCS_TEST_URL=http://127.0.0.1:8080 npm run test:browser
```

`check` runs strict TypeScript, ESLint/content checks, reference drift checking, formatting, and a production build with broken links treated as errors. Browser tests target a running production server. Screenshots and reports are ignored by Git.

```bash
npm run sources:check
npm run sources:refresh
npm run references
```

Source checking/refreshing requires the sibling Seagull repositories, optionally selected with `SEAGULL_WORKSPACE`. **Ordinary installs, checks, and builds do not.** Review source changes and update authored status claims before regenerating references. `sources/manifest.json` records the evidence baseline. See `docs/development/documentation.mdx` for versioning and contribution rules.

## Repository layout

- `docs/`: authored guides, ADR snapshots, and generated references.
- `src/`: homepage, small EUI components, build-time diagram components and definitions (`src/diagrams/`), theme integration, visual tokens.
- `static/`: local identity asset and canonical protocol downloads.
- `sources/`: selected versioned generation inputs and source inventory.
- `scripts/`: deterministic reference generation and validation.
- `docker/`: development entrypoint and static-server configuration.
- `tests/`: browser checks; `.github/workflows/ci.yml`: independent CI.

The V2 agent does not yet collect/upload telemetry and the V2 frontend is a placeholder. The site documents these limits explicitly. Backend, agent, and frontend builds do not depend on this repository.

Dependency overrides are deliberate. Webpack 5.105.4 avoids the Docusaurus 3.9/webpackbar incompatibility with newer ProgressPlugin validation. `@docusaurus/theme-common` and `@docusaurus/plugin-content-docs` are pinned to 3.9.2 because the search plugin resolves a newer minor: two copies of those packages produce two React context instances, and every static page then fails to render with `useColorMode is called outside the <ColorModeProvider>`. The remaining overrides resolve transitive audit findings. Re-evaluate them with framework upgrades. Framework behavior was checked against [Docusaurus configuration](https://docusaurus.io/docs/api/docusaurus-config), [EUI provider guidance](https://eui.elastic.co/docs/utilities/provider/), and the [upstream Webpack compatibility issue](https://github.com/facebook/docusaurus/issues/11974).

License: GPL-3.0-only; see `LICENSE`. Source excerpts retain their originating project context.
